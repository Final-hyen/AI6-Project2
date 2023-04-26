import { UserUpdateRequest } from './../application/dto/request/user.update.request';
import container from '../../app/container/container';
import { UserService } from './../application/user.service';
import { commonErrors } from './../../misc/error/error.common';
import { AppError } from './../../misc/error/error.app';
import { RegisterRequest } from './../application/dto/request/user.register.request';
import { Types } from '../../app/container/types.di';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const userService: UserService = container.get(Types.USER_SERVICE);

export const checkCreatable =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const registerRequest: RegisterRequest = req.body as RegisterRequest;

    // 이미 존재하는 이메일인지 검증한다
    const isAlreadyExistEmail: boolean = await userService.isAlreadyExistEmail(
      registerRequest.email,
    );

    if (isAlreadyExistEmail) {
      return next(
        new AppError(commonErrors.INPUT_ERROR, 400, `중복된 이메일입니다`),
      );
    }

    // 이미 존재하는 닉네임인지 검증한다
    const isAlreadyExistNickname: boolean =
      await userService.isAlreadyExistNickname(registerRequest.nickname);

    if (isAlreadyExistNickname) {
      return next(
        new AppError(commonErrors.INPUT_ERROR, 400, `중복된 닉네임입니다`),
      );
    }

    next();
  };

// 업데이트가 가능한지 검증하는 미들웨어
export const checkUpdatable = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { nickname } = req.body;

  // 이미 존재하는 닉네임인지 검증한다
  if (nickname) {
    await verifyIsExistNickname(nickname, next);
  }

  next();
};

// 액세스 토큰을 검증해서 res.locals.tokenPayload에 넣어주는 미들웨어
export const verifyAccessToken = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.locals.tokenPayload = jwt.verify(
      req.headers.authorization!,
      accessTokenSecret!,
    );
    next();
  } catch (error) {
    sendJwtError(error, next);
  }
};

// 리프레시 토큰을 검증해서 res.locals.tokenPayload에 넣어주는 미들웨어
export const verifyRefreshToken = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.locals.tokenPayload = jwt.verify(
      req.headers.authorization!,
      refreshTokenSecret!,
    );
    next();
  } catch (error) {
    sendJwtError(error, next);
  }
};

// jwt 에러를 처리하는 함수
function sendJwtError(error: unknown, next: NextFunction) {
  const description =
    error instanceof jwt.TokenExpiredError
      ? '토큰이 만료되었습니다'
      : '유효하지 않은 토큰입니다';

  return next(
    new AppError(commonErrors.AUTHENTICATION_ERROR, 401, description),
  );
}

// 닉네임 검증 함수
async function verifyIsExistNickname(nickname: string, next: NextFunction) {
  const isAlreadyExistNickname: boolean =
    await userService.isAlreadyExistNickname(nickname);

  if (isAlreadyExistNickname) {
    return next(
      new AppError(commonErrors.INPUT_ERROR, 400, `중복된 닉네임입니다`),
    );
  }
}
