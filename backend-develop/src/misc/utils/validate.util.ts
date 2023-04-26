import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { commonErrors } from '../error/error.common';
import { AppError } from '../error/error.app';
import { NextFunction, Request, Response } from 'express';

// class-validator에 의해 dto를 검증하는 함수
export function validateBody(schema: { new (...args: any[]): any }) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const target = plainToInstance(schema, req.body);
    try {
      await validateOrReject(target);
      next();
    } catch (e) {
      next(
        new AppError(
          commonErrors.REQUEST_VALIDATION_ERROR,
          400,
          '올바르지 않은 입력입니다',
        ),
      );
    }
  };
}