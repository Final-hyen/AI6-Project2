import { UserService } from './../../../user/application/user.service';
import { BoardService } from './../../boards/application/board.service';
import { inject, injectable } from 'inversify';
import { CommentService } from '../application/comment.service';
import { RegisterCommentRequest } from '../application/dto/request/comment.register.request';
import { UpdateCommentRequest } from '../application/dto/request/comment.update.request';
import express from 'express';
import { Types } from '../../../app/container/types.di';
import container from '../../../app/container/container';

@injectable()
export class CommentController {
  // 댓글 생성
  async createdComment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const commentService = container.get<CommentService>(Types.COMMENT_SERVICE);
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);
    const userService = container.get<UserService>(Types.USER_SERVICE);

    const registerCommentRequest = RegisterCommentRequest.of(req);
    const id: string = req.params.boardId;
    const { sub } = res.locals.tokenPayload;
    const user = await userService.getProfileByUserId(sub);

    const nickname = user ? user.nickname : 'fakeNickname';
    const getBoardId: any = await boardService.getBoardByOnlyId(id);
    const boardId: string = getBoardId._id;
    const result = await commentService.createComment(
      nickname,
      boardId,
      registerCommentRequest,
    );

    res.locals.data = result;
    next();
  }

  // 댓글 전체 조회
  async getAllComments(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const commentService = container.get<CommentService>(Types.COMMENT_SERVICE);
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 10);
    const Id: string = req.params.boardId;
    const result = await commentService.findAllComments(Id, page, limit);

    res.locals.data = result;
    next();
  }

  // 댓글 수정
  async updateComment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const commentService = container.get<CommentService>(Types.COMMENT_SERVICE);

    const id: string = req.params.id;
    const updateCommentRequest = UpdateCommentRequest.of(req);
    const result = await commentService.updateComment(id, updateCommentRequest);

    res.locals.data = result;
    next();
  }

  // 댓글 삭제
  async deleteBoard(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const commentService = container.get<CommentService>(Types.COMMENT_SERVICE);
    const id: string = req.params.id;
    const result = await commentService.deleteComment(id);

    res.locals.data = result;
    next();
  }
}
