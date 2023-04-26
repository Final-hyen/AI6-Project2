import { Router } from 'express';
import { LetterController } from '../presentation/letter.controller';
import {
  checkLetterCreatable,
  checkIsValidUser,
} from './../presentation/letter.middleware';
import { LetterCreateRequest } from '../application/dto/request/letter.create.request';
import { verifyAccessToken } from '../../user/presentation/user.middleware';
import container from '../../app/container/container';
import { Types } from '../../app/container/types.di';
import { validateBody } from '../../misc/utils/validate.util';
import {
  paginatedResponseMiddleware,
  responseMiddleware,
} from '../../misc/utils/response.util';

const letterRouter: Router = Router({ mergeParams: true });
const letterController: LetterController = container.get<LetterController>(
  Types.LETTER_CONTROLLER,
);

// 쪽지 생성
letterRouter.post(
  '/',
  verifyAccessToken,
  checkIsValidUser,
  validateBody(LetterCreateRequest),
  checkLetterCreatable,
  letterController.createLetter,
  responseMiddleware,
);

//받은 메세지를 페이지네이션 기반으로 조회
letterRouter.get(
  '/inbox',
  verifyAccessToken,
  checkIsValidUser,
  letterController.getReceivedLetterList,
  paginatedResponseMiddleware,
);

// 보낸 편지 목록을 페이지네이션 기반으로 조회
letterRouter.get(
  '/outbox',
  verifyAccessToken,
  checkIsValidUser,
  letterController.getSentLetterList,
  paginatedResponseMiddleware,
);

// 수신자에 의해서 편지를 삭제하는 endpoint
letterRouter.delete(
  '/:id/inbox',
  verifyAccessToken,
  checkIsValidUser,
  letterController.deleteReceivedLetter,
  responseMiddleware,
);

// 발신자에 의해서 편지를 삭제하는 endpoint
letterRouter.delete(
  '/:id/outbox',
  verifyAccessToken,
  checkIsValidUser,
  letterController.deleteSentLetter,
  responseMiddleware,
);

export default letterRouter;
