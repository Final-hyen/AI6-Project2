import { UserUpdateRequest } from './dto/request/user.update.request';
import { UserProfileResponse } from './dto/response/user.profile.response';
import { RedisCache } from './../../misc/utils/redis.util';
import { JwtLoginPayload } from './../common/auth.utils';
import { commonErrors } from './../../misc/error/error.common';
import { AppError } from './../../misc/error/error.app';
import { UserLoginResponse } from './dto/response/user.login.response';
import { UserLoginRequest } from './dto/request/user.login.request';
import { inject, injectable } from 'inversify';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { RegisterRequest } from './dto/request/user.register.request';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Types } from '../../app/container/types.di';
import {
  getRedisTtlFromDay,
  getRefreshTokenKey,
} from '../../misc/utils/redis.util';
import {
  generateAccessTokenPayload,
  generateRefreshTokenPayload,
} from '../common/auth.utils';
import { UserRefreshResponse } from './dto/response/user.refresh.response';
import { UserRefreshRequest } from './dto/request/user.refresh.request';
import { toUpdateEntity } from '../../misc/utils/request.util';

@injectable()
export class UserService {
  constructor(
    @inject(Types.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  // Redis cache 보존 기간
  private readonly ttl: number = getRedisTtlFromDay(
    Number(process.env.REFRESH_TOKEN_EXP_DAY),
  );

  // 회원가입
  async signUp(registerRequest: RegisterRequest): Promise<string> {
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const registerUser = registerRequest.toUserEntity();

    const savedUser = await this.userRepository.save(registerUser);

    return 'OK';
  }

  // 유저 로그인
  async login(loginRequest: UserLoginRequest): Promise<UserLoginResponse> {
    const { email, password } = loginRequest;

    // 이메일, 패스워드 검증 이후에 userId, role을 취득해온다
    const { id, role } = await this.verifyLoginRequest(email, password);

    // payload 생성
    const accessTokenPayload = generateAccessTokenPayload(id, role);
    const refreshTokenPayload = generateRefreshTokenPayload(id, role);

    // accessToken, refreshToken 생성
    const accessToken = this.generateAccessToken(accessTokenPayload);
    const refreshToken = this.generateRefreshToken(refreshTokenPayload);

    // redis에 refreshToken 보관
    await this.cacheRefreshToken(id, refreshToken);

    return new UserLoginResponse(accessToken, refreshToken);
  }

  // 유저 로그아웃
  async logout(userId: number): Promise<string | null> {
    return await this.deleteRefreshToken(userId);
  }

  // 유저 정보 변경
  async updateUserInfo(
    sub: number,
    userId: number,
    updateRequest: UserUpdateRequest,
  ): Promise<string> {
    // 토큰의 userId와 userId가 일치하지 않으면 에러 처리
    if (sub !== userId) {
      throw new AppError(commonErrors.INPUT_ERROR, 400, '유저 정보가 일치하지 않습니다');
    }

    const targetUser = await this.userRepository.findById(userId);

    if (!targetUser) {
      throw new AppError(commonErrors.RESOURCE_NOT_FOUND_ERROR, 400, '해당 유저가 존재하지 않습니다');
    }

    await updateRequest.encryptPassword();
    const newUser = toUpdateEntity(targetUser, updateRequest);

    await this.userRepository.save(newUser);

    return 'OK';
  }

  // 리프레시 토큰이 올바른지 검증하고 액세스 토큰을 새로 반환해주는 메소드
  async issueNewAccessTokenByRefreshToken(
    userRefreshRequest: UserRefreshRequest,
  ): Promise<UserRefreshResponse> {
    const { userId, role, refreshToken } = userRefreshRequest;

    // userId를 이용해서 redis에 저장된 리프레시 토큰을 가져온다
    const refreshTokenFromCache = await this.getRefreshToken(userId);

    if (!refreshTokenFromCache) {
      throw new AppError(
        commonErrors.AUTHENTICATION_ERROR,
        401,
        '토큰이 만료되었습니다',
      );
    }

    // refreshToken 동일성 비교
    if (refreshTokenFromCache !== refreshToken) {
      throw new AppError(
        commonErrors.AUTHENTICATION_ERROR,
        401,
        '올바르지 않은 토큰입니다',
      );
    }

    // 액세스 토큰 재발급
    const accessTokenPayload = generateAccessTokenPayload(userId, role);
    const accessToken = this.generateAccessToken(accessTokenPayload);

    return new UserRefreshResponse(accessToken);
  }

  // userId를 이용해서 유저의 프로필을 조회하는 메소드
  async getProfileByUserId(
    userId: number,
  ): Promise<UserProfileResponse | null> {
    const foundUser = await this.userRepository.findById(userId);

    // foundUser가 삭제되지 않아야하고, null이 아니여야만 UserProfileResponse를 생성한다
    const userProfileResponse =
      foundUser && foundUser.isDeleted === false
        ? UserProfileResponse.fromEntity(foundUser)
        : null;

    return userProfileResponse;
  }

  // 유저를 삭제하는 메소드
  async deleteUser(userId: number, sub: number): Promise<string | null> {
    // 만일 토큰에 있는 userId와 param으로 부터 받아온 userId가 일치하지 않으면 예외 처리
    if (userId !== sub) {
      throw new AppError(
        commonErrors.INPUT_ERROR,
        400,
        '잘못된 유저 정보입니다.',
      );
    }

    const deletedUser = await this.userRepository.deleteById(userId);

    // 만일 삭제에 실패하면 false를 바로 반환한다
    if (!deletedUser) {
      return null;
    }

    // redis 상에 존재하는 리프레시 토큰을 삭제한다
    await this.deleteRefreshToken(userId);

    // 결과 반환
    return 'OK';
  }

  // 이미 존재하는 이메일을 지닌 유저가 있는가?
  async isAlreadyExistEmail(email: string): Promise<boolean> {
    const foundUser: User | null = await this.userRepository.findOneByEmail(
      email,
    );

    return foundUser ? true : false;
  }

  // 해당 닉네임이 이미 존재하는가?
  async isAlreadyExistNickname(nickname: string): Promise<boolean> {
    const foundUser: User | null = await this.userRepository.findOneByNickname(
      nickname,
    );

    return foundUser ? true : false;
  }

  // 토큰을 생성하는 메소드
  private generateAccessToken(payload: JwtLoginPayload): string {
    const accessTokenExpIn = `${process.env.ACCESS_TOKEN_EXP_HOUR}h`;

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: accessTokenExpIn,
    });
  }

  private generateRefreshToken(payload: JwtLoginPayload): string {
    const refreshTokenExpIn = `${process.env.REFRESH_TOKEN_EXP_DAY}d`;

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: refreshTokenExpIn,
    });
  }

  // Redis에 refreshToken을 보관하는 메소드
  private async cacheRefreshToken(
    userId: number,
    token: string,
  ): Promise<string | null> {
    const key = getRefreshTokenKey(userId);

    return await RedisCache.set(key, token, this.ttl);
  }

  // Redis로부터 refreshToken을 가져오는 메소드
  private async getRefreshToken(userId: number): Promise<string | null> {
    const key = getRefreshTokenKey(userId);

    return await RedisCache.get(key);
  }

  // Redis에서 refreshToken을 삭제하는 메소드
  private async deleteRefreshToken(userId: number): Promise<string | null> {
    const key = getRefreshTokenKey(userId);

    return await RedisCache.deleteOne(key);
  }

  // 유저를 검증하고, 올바른 요청이면 유저 엔티티를 반횐해주는 메소드
  private async verifyLoginRequest(
    email: string,
    password: string,
  ): Promise<User> {
    // 해당 이메일이 존재하는가?
    const targetUser = await this.userRepository.findOneByEmail(email);

    if (!targetUser || targetUser.isDeleted) {
      throw new AppError(
        commonErrors.AUTHENTICATION_ERROR,
        401,
        '이메일 혹은 패스워드를 다시 확인해주십시오.',
      );
    }

    // 패스워드 체크
    const isCorrectPassword = await bcrypt.compare(
      password,
      targetUser.password,
    );

    if (!isCorrectPassword) {
      throw new AppError(
        commonErrors.AUTHENTICATION_ERROR,
        401,
        '이메일 혹은 패스워드를 다시 확인해주십시오.',
      );
    }

    return targetUser;
  }
}
