import { inject, injectable } from 'inversify';
import { BoardService } from '../application/board.service';
import { RegisterBoardRequest } from '../application/dto/request/board.register.request';
import { UpdateBoardRequest } from '../application/dto/request/board.update.request';
import express from 'express';
import { Types } from '../../../app/container/types.di';
import container from '../../../app/container/container';
import { UserService } from '../../../user/application/user.service';

@injectable()
export class BoardController {
  // 게시판 생성
  async createdBoard(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);
    const userService = container.get<UserService>(Types.USER_SERVICE);

    const registerBoardRequest = RegisterBoardRequest.of(req);
    const { sub } = res.locals.tokenPayload;

    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';
    const result = await boardService.createBoard(
      nickname,
      registerBoardRequest,
      sub
    );

    res.locals.data = result;
    next();
  }

  // 게시판 전체 조회
  async getAllBoards(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);
    const page: number = Number(req.query.page || 1);
    const limit: number = Number(req.query.limit || 10);

    const result = await boardService.findAllBoards(page, limit);

    res.locals.data = result;
    next();
  }

  // 게시판 상세 조회
  async getBoard(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);

    const id: string = req.params.id;
    const result = await boardService.getBoardData(id);

    res.locals.data = result;
    next();
  }

  // 게시판 수정
  async updateBoard(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);
    const userService = container.get<UserService>(Types.USER_SERVICE);

    const updateBoardRequest = UpdateBoardRequest.of(req);
    const id: string = req.params.id;
    const { sub } = res.locals.tokenPayload;

    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';
    const result = await boardService.updateBoard(
      nickname,
      id,
      updateBoardRequest,
    );

    res.locals.data = result;
    next();
  }

  // 게시판 삭제
  async deleteBoard(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);
    const userService = container.get<UserService>(Types.USER_SERVICE);

    const id: string = req.params.id;
    const { sub } = res.locals.tokenPayload;

    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';
    const result = await boardService.deleteBoard(nickname, id);

    res.locals.data = result;
    next();
  }

  // 게시판-참여 신청
  async joinBoard(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const boardService = container.get<BoardService>(Types.BOARD_SERVICE);
    const userService = container.get<UserService>(Types.USER_SERVICE);

    const id: string = req.params.id;
    const { sub } = res.locals.tokenPayload;

    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';
    const result = await boardService.joinBoard(nickname, id);

    res.locals.data = result;
    next();
  }
}
