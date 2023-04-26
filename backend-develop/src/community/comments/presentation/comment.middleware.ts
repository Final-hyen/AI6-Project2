import { UserService } from './../../../user/application/user.service';
import container from '../../../app/container/container';
import { CommentService } from '../application/comment.service';
import { BoardService } from '../../boards/application/board.service';
import { commonErrors } from '../../../misc/error/error.common';
import { AppError } from '../../../misc/error/error.app';
import { RegisterCommentRequest } from '../application/dto/request/comment.register.request';
import { UpdateCommentRequest } from '../application/dto/request/comment.update.request';
import express from 'express';
import { Types } from '../../../app/container/types.di';

const commentService: CommentService = container.get(Types.COMMENT_SERVICE);
const boardService: BoardService = container.get(Types.BOARD_SERVICE);
const userService: UserService = container.get(Types.USER_SERVICE);

export const checkCreatable =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const registerCommentRequest: RegisterCommentRequest =
      req.body as RegisterCommentRequest;

    // 댓글 글자수 제한(200)
    const isMaxContent: boolean = await commentService.isMaxContent(
      registerCommentRequest.content,
    );
    if (isMaxContent) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `댓글은 200자까지만 허용합니다.`,
        ),
      );
    }
    next();
  };

export const checkBoardExist =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const boardId: string = req.params.boardId;

    // 게시글 존재 여부 확인
    const isExistBoard: boolean = await boardService.isExistId(boardId);
    if (isExistBoard) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          204,
          `해당 id의 게시글은 존재하지 않습니다.`,
        ),
      );
    }
    next();
  };
export const checkCommentExist =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // 댓글 존재 여부 확인
    const id: string = req.params.id;
    const isExistId: boolean = await commentService.isExistId(id);
    if (isExistId) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          204,
          `해당 id의 댓글은 존재하지 않습니다.`,
        ),
      );
    }

    // 댓글에 대한 접근 권한 확인
    const { sub } = res.locals.tokenPayload;
    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';
    const isUserComment: boolean = await commentService.isUserComment(nickname);
    if (isUserComment) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          204,
          `해당 댓글에 대한 접근 권한이 없습니다.`,
        ),
      );
    }
    next();
  };

export const checkPatchable =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const updateCommentRequest: UpdateCommentRequest =
      req.body as UpdateCommentRequest;

    // 댓글 글자 수 제한(200)
    const isMaxContent: boolean = await commentService.isMaxContent(
      updateCommentRequest.content,
    );
    if (isMaxContent) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `댓글은 200자까지만 허용합니다.`,
        ),
      );
    }
    next();
  };
