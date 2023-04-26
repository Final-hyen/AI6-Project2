import { BoardController } from './board.controller';
import container from '../../../app/container/container';
import { BoardService } from '../application/board.service';
import { commonErrors } from '../../../misc/error/error.common';
import { AppError } from '../../../misc/error/error.app';
import { RegisterBoardRequest } from '../application/dto/request/board.register.request';
import { UpdateBoardRequest } from '../application/dto/request/board.update.request';
import express from 'express';
import { Types } from '../../../app/container/types.di';
import { UserService } from '../../../user/application/user.service';

const boardService: BoardService = container.get(Types.BOARD_SERVICE);
const userService: UserService=container.get(Types.USER_SERVICE);

export const checkCreatable =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const registerBoardRequest: RegisterBoardRequest =
      req.body as RegisterBoardRequest;

    // title 글자수 제한(50)
    const isMaxTitle: boolean = await boardService.isMaxTitle(
      registerBoardRequest.title,
    );
    if (isMaxTitle) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `제목은 50자까지만 허용합니다.`,
        ),
      );
    }
    // content 글자수 제한(500)
    const isMaxContent: boolean = await boardService.isMaxContent(
      registerBoardRequest.content,
    );
    if (isMaxContent) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `본문은 50자까지만 허용합니다.`,
        ),
      );
    }
    // 참여신청 인원 제한(8)
    const isMaxTotalCount: boolean = await boardService.isMaxTotalCount(
      registerBoardRequest.totalCount,
    );
    if (isMaxTotalCount) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `최대 참여 인원은 8명입니다.`,
        ),
      );
    }
    next();
  };

export const checkIdExist =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id: string = req.params.id;

    // 해당 id의 게시글 존재 여부
    const isExistId: boolean = await boardService.isExistId(id);
    if (isExistId) {
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

  export const CheckIsYours=()=>async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { sub } = res.locals.tokenPayload;

    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';

    // 해당 id의 게시글 존재 여부
    const isYours: boolean = await boardService.isYours(nickname);
    if (isYours) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          204,
          `접근 권한이 없습니다.`,
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
    const updateBoardRequest: UpdateBoardRequest =
      req.body as UpdateBoardRequest;

    // title, content 하나라도 존재하는지 확인
    const isExistedOne: boolean = await boardService.isExistedOne(
      updateBoardRequest?.title,
      updateBoardRequest?.content,
    );
    if (isExistedOne) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `title, content 둘 중 하나는 존재해야합니다.`,
        ),
      );
    }
    // title 글자수 제한(50)
    const isMaxTitle: boolean = await boardService.isMaxTitle(
      updateBoardRequest.title,
    );
    if (isMaxTitle) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `제목은 50자까지만 허용합니다.`,
        ),
      );
    }
    // content 글자수 제한(500)
    const isMaxContent: boolean = await boardService.isMaxContent(
      updateBoardRequest.content,
    );
    if (isMaxContent) {
      return next(
        new AppError(
          commonErrors.INPUT_ERROR,
          400,
          `본문은 50자까지만 허용합니다.`,
        ),
      );
    }
    next();
  };

export const checkJoinable =
  () =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userService = container.get<UserService>(Types.USER_SERVICE);
    const { sub } = res.locals.tokenPayload;
    const user = await userService.getProfileByUserId(sub);
    const nickname = user ? user.nickname : 'fakeNickname';
    const id: string = req.params.id;
    const checkCount = await boardService.checkCount(id);
    const checkJoinnedList = await boardService.checkJoinnedList(id, nickname);

    // 사전 설정된 참여자 수와 현재 신청자 수 비교
    if (checkCount) {
      return next(
        new AppError(commonErrors.INPUT_ERROR, 400, `모집 정원이 다 찼습니다.`),
      );
    }
    // 참여 신청자 중복 여부 확인
    if (checkJoinnedList) {
      return next(
        new AppError(commonErrors.INPUT_ERROR, 400, `이미 신청하였습니다.`),
      );
    }
    next();
  };
