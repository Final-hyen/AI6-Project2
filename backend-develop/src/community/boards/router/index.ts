import { RegisterBoardRequest } from '../application/dto/request/board.register.request';
import { UpdateBoardRequest } from '../application/dto/request/board.update.request';
import { BoardController } from '../presentation/board.controller';
import container from '../../../app/container/container';
import {
  checkCreatable,
  checkIdExist,
  checkPatchable,
  checkJoinable,
  CheckIsYours
} from '../presentation/board.middleware';
import { Router } from 'express';
import { responseMiddleware } from '../../../misc/utils/response.util';
import { validateBody } from '../../../misc/utils/validate.util';
import { verifyAccessToken } from './../../../user/presentation/user.middleware';
import { Types } from '../../../app/container/types.di';

const boardRouter: Router = Router();
const boardController: BoardController = container.get<BoardController>(
  Types.BOARD_CONTROLLER,
);

// 게시판 생성
boardRouter.post(
  '/',
  verifyAccessToken,
  validateBody(RegisterBoardRequest),
  checkCreatable(),
  boardController.createdBoard,
  responseMiddleware,
);

// 게시판 전체 조회
boardRouter.get(
  '/',
  verifyAccessToken,
  boardController.getAllBoards,
  responseMiddleware,
);

// 게시판 상세 조회
boardRouter.get(
  '/:id',
  verifyAccessToken,
  checkIdExist(),
  boardController.getBoard,
  responseMiddleware,
);

// 게시글 수정
boardRouter.put(
  '/:id',
  verifyAccessToken,
  checkIdExist(),
  CheckIsYours(),
  validateBody(UpdateBoardRequest),
  checkPatchable(),
  boardController.updateBoard,
  responseMiddleware,
);

// 게시글 삭제
boardRouter.delete(
  '/:id',
  verifyAccessToken,
  checkIdExist(),
  CheckIsYours(),
  boardController.deleteBoard,
  responseMiddleware,
);

// 참여 신청
boardRouter.post(
  '/:id/participants',
  verifyAccessToken,
  checkIdExist(),
  checkJoinable(),
  boardController.joinBoard,
  responseMiddleware,
);

export default boardRouter;
