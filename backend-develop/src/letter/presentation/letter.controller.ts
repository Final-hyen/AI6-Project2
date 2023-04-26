import { LetterCreateRequest } from '../application/dto/request/letter.create.request';
import { injectable } from 'inversify';
import { Types } from '../../app/container/types.di';
import container from '../../app/container/container';
import { Request, Response, NextFunction } from 'express';
import { LetterService } from '../application/letter.service';
import { transformToNumber } from '../../misc/utils/request.util';
import { bindPaginatedResponse } from '../../misc/utils/response.util';

@injectable()
export class LetterController {
  async createLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const letterService = container.get<LetterService>(Types.LETTER_SERVICE);

      const { userId } = req.params;
      const { receiverId, content } = req.body;

      const createRequest = new LetterCreateRequest(
        Number(receiverId),
        content,
      );
      const result = await letterService.create(createRequest, Number(userId));

      res.locals.data = result;
      next();
    } catch (error) {
      next(error);
    }
  }

  // 수신된 쪽지들을 조회하는 메소드
  async getReceivedLetterList(req: Request, res: Response, next: NextFunction) {
    try {
      const letterService = container.get<LetterService>(Types.LETTER_SERVICE);

      const { page, limit } = req.query;
      const { userId } = req.params;

      const [numericUserId, numericPage, numericLimit] = transformToNumber(
        userId,
        page,
        limit,
      );

      const [letterResponseList, totalElements] =
        await letterService.getReceivedLetterList(
          numericUserId,
          numericPage,
          numericLimit,
        );

      // 페이징 처리된 결과를 res.locals에 바인딩
      bindPaginatedResponse(res, letterResponseList, totalElements);
      next();
    } catch (error) {
      next(error);
    }
  }

  // 발신한 쪽지들을 조회하는 메소드
  async getSentLetterList(req: Request, res: Response, next: NextFunction) {
    try {
      const letterService = container.get<LetterService>(Types.LETTER_SERVICE);

      const { page, limit } = req.query;
      const { userId } = req.params;

      // 모두 숫자 타입으로 변환
      const [numericUserId, numericPage, numericLimit] = transformToNumber(
        userId,
        page,
        limit,
      );

      const [letterResponseList, totalElements] =
        await letterService.getSentLetterList(
          numericUserId,
          numericPage,
          numericLimit,
        );

      // 페이징 처리된 결과를 res.locals에 바인딩
      bindPaginatedResponse(res, letterResponseList, totalElements);
      next();
    } catch (error) {
      next(error);
    }
  }

  // 수신된 편지를 삭제하는 메소드
  async deleteReceivedLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const letterService = container.get<LetterService>(Types.LETTER_SERVICE);

      const { id } = req.params;

      const deleteResult = await letterService.deleteReceivedLetter(Number(id));

      res.locals.data = deleteResult;
      next();
    } catch (error) {
      next(error);
    }
  }

  // 발신된 편지를 삭제하는 메소드
  async deleteSentLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const letterService = container.get<LetterService>(Types.LETTER_SERVICE);

      const { id } = req.params;

      const deleteResult = await letterService.deleteSentLetter(Number(id));

      res.locals.data = deleteResult;
      next();
    } catch (error) {
      next(error);
    }
  }
}
