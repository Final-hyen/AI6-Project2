import { UserUpdateRequest } from './../application/dto/request/user.update.request';
import { UserLoginRequest } from './../application/dto/request/user.login.request';
import { injectable } from 'inversify';
import { UserService } from './../application/user.service';
import { RegisterRequest } from './../application/dto/request/user.register.request';
import { Types } from '../../app/container/types.di';
import container from '../../app/container/container';
import { Request, Response, NextFunction } from 'express';
import { UserRefreshRequest } from '../application/dto/request/user.refresh.request';

@injectable()
export class UserController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = container.get<UserService>(Types.USER_SERVICE);
      const {email, password, nickname, gender, birthDate} = req.body;

      const registerRequest = new RegisterRequest(email, password, nickname, gender, birthDate);

      const signUpResponse = await userService.signUp(registerRequest);

      res.locals.data = signUpResponse;
      next();
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = container.get<UserService>(Types.USER_SERVICE);

      const { email, password } = req.body;
      const loginRequest = new UserLoginRequest(email, password);

      const loginResponse = await userService.login(loginRequest);

      res.locals.data = loginResponse;
      next();
    } catch (error) {
      next(error);
    }
  }

  // 리프레시 토큰을 기반으로 새로운 액세스 토큰을 발급받는 메소드
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = container.get<UserService>(Types.USER_SERVICE);

      const { sub, role } = res.locals.tokenPayload;
      const refreshToken = req.headers.authorization!;

      const refreshRequest = new UserRefreshRequest(sub, role, refreshToken);

      const refreshResponse =
        await userService.issueNewAccessTokenByRefreshToken(refreshRequest);

      res.locals.data = refreshResponse;
      next();
    } catch (error) {
      next(error);
    }
  }

  // 유저 로그아웃을 처리하는 메소드
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = container.get<UserService>(Types.USER_SERVICE);

      const { sub } = res.locals.tokenPayload;

      const logoutResponse = await userService.logout(sub);

      res.locals.data = logoutResponse;
      next();
    } catch (error) {
      next(error);
    }
  }

  // 유저 프로파일 조회를 처리하는 메소드
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = container.get<UserService>(Types.USER_SERVICE);

      const { sub } = res.locals.tokenPayload;

      const profileResponse = await userService.getProfileByUserId(sub);

      res.locals.data = profileResponse;
      next();
    } catch (error) {
      next(error);
    }
  }

  // 회원탈퇴를 수행하는 메소드
  async unRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
     const userService = container.get<UserService>(Types.USER_SERVICE);

      const { userId } = req.params;
      const { sub } = res.locals.tokenPayload; 

      const deleteResponse = await userService.deleteUser(Number(userId), sub);

      res.locals.data = deleteResponse;
      next();
    } catch(error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = container.get<UserService>(Types.USER_SERVICE);

      const { userId } = req.params;
      const { sub } = res.locals.tokenPayload;
      const { password, nickname } = req.body;
      
      const updateRequest = new UserUpdateRequest(password, nickname);
      const updateResult = await userService.updateUserInfo(sub, Number(userId), updateRequest);

      res.locals.data = updateResult;
      next();
    } catch(error) {
      next(error);
    }
  }
}
