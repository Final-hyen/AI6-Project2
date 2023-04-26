import { RegisterCommentRequest } from '../application/dto/request/comment.register.request';
import { UpdateCommentRequest } from '../application/dto/request/comment.update.request';
import { CommentController } from '../presentation/comment.controller';
import container from '../../../app/container/container';
import {
  checkCreatable,
  checkBoardExist,
  checkCommentExist,
  checkPatchable,
} from '../presentation/comment.middleware';
import { Router } from 'express';
import { responseMiddleware } from '../../../misc/utils/response.util';
import { validateBody } from '../../../misc/utils/validate.util';
import { Types } from '../../../app/container/types.di';
import { verifyAccessToken } from './../../../user/presentation/user.middleware';

const commentRouter: Router = Router();
const commentController: CommentController = container.get<CommentController>(
  Types.COMMENT_CONTROLLER,
);

// 댓글 생성
commentRouter.post(
  '/boards/:boardId/comments',
  verifyAccessToken,
  checkBoardExist(),
  validateBody(RegisterCommentRequest),
  checkCreatable(),
  commentController.createdComment,
  responseMiddleware,
);

// 댓글 전체 조회
commentRouter.get(
  '/boards/:boardId/comments',
  verifyAccessToken,
  checkBoardExist(),
  commentController.getAllComments,
  responseMiddleware,
);

// 댓글 수정
commentRouter.put(
  '/boards/:boardId/comments/:id',
  verifyAccessToken,
  checkBoardExist(),
  checkCommentExist(),
  validateBody(UpdateCommentRequest),
  checkPatchable(),
  commentController.updateComment,
  responseMiddleware,
);

// 댓글 삭제
commentRouter.delete(
  '/boards/:boardId/comments/:id',
  verifyAccessToken,
  checkBoardExist(),
  checkCommentExist(),
  commentController.deleteBoard,
  responseMiddleware,
);
export default commentRouter;
