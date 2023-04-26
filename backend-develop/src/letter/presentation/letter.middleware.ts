import { commonErrors } from './../../misc/error/error.common';
import { AppError } from './../../misc/error/error.app';
import { UserService } from './../../user/application/user.service';
import container from '../../app/container/container';
import { LetterService } from '../application/letter.service';
import { Types } from '../../app/container/types.di';
import { Request, NextFunction, Response } from 'express';

const letterService = container.get<LetterService>(Types.LETTER_SERVICE);
const userService = container.get<UserService>(Types.USER_SERVICE);

// 해당 쪽지가 생성 가능한지 여부를 판별하는 미들웨어
export const checkLetterCreatable = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { receiverId, content } = req.body;

  // receiverId에 대응하는 유저가 실제 존재하는지를 검증한다
  const receiver = await userService.getProfileByUserId(Number(receiverId));

  if (!receiver) {
    return next(
      new AppError(commonErrors.INPUT_ERROR, 400, '수신자가 올바르지 않습니다'),
    );
  }

  next();
};

// request 내부에 있는 userId와 토큰의 결과로 나온 sub가 일치하는지 여부를 판별하는 미들웨어
// verifyAccessToken 다음으로 위치해야 정상 동작함
export const checkIsValidUser = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  const { sub } = res.locals.tokenPayload;

  if (Number(userId) !== sub) {
    return next(
      new AppError(commonErrors.INPUT_ERROR, 400, '잘못된 유저 정보입니다.'),
    );
  }

  next();
};
