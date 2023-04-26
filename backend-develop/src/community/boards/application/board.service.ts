import { BoardRepository } from './../domain/board.repository';
import { inject, injectable } from 'inversify';
import { Boards } from '../domain/board.entity';
import { RegisterBoardRequest } from './dto/request/board.register.request';
import { UpdateBoardRequest } from './dto/request/board.update.request';
import { Types } from '../../../app/container/types.di';

@injectable()
export class BoardService {
  constructor(
    @inject(Types.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  // 게시글 생성
  async createBoard(
    nickname: string,
    registerBoardRequest: RegisterBoardRequest,
    sub:string
  ): Promise<object> {
    const createdNewBoard = await this.boardRepository.create(nickname, {
      title: registerBoardRequest.title,
      content: registerBoardRequest.content,
      totalCount: registerBoardRequest.totalCount,
    },sub);
    return createdNewBoard;
  }

  // title 글자 수 50자 초과 여부
  async isMaxTitle(title: string | null): Promise<boolean> {
    return title && title.length > 50 ? true : false;
  }

  // content 글자 수 500자 초과 여부
  async isMaxContent(content: string | null): Promise<boolean> {
    return content && content.length > 50 ? true : false;
  }

  // totalCount(참여인원) 8명 초과 여부
  async isMaxTotalCount(totalCount: number): Promise<boolean> {
    return totalCount > 8 ? true : false;
  }

  // 게시판 전체 조회
  async findAllBoards(page: number, limit: number): Promise<object> {
    const boards = await this.boardRepository.findAllBoards(page, limit);

    return boards;
  }

  // 게시판 상세 조회
  async getBoardData(id: string): Promise<object | null> {
    const board = await this.boardRepository.findBoardById(id);

    return board;
  }

  // 해당 id의 게시글 존재 여부
  async isExistId(id: string): Promise<boolean> {
    const board = await this.boardRepository.findBoardBool(id);
    return board ? false : true;
  }

  // title, content 하나라도 존재하는지 확인
  async isExistedOne(title?: string, content?: string): Promise<boolean> {
    return !title && !content ? true : false;
  }

  // 접근 권한 확인(본인 글인지 확인)
  async isYours(nickname:string):Promise<boolean>{
    const isyours=await this.boardRepository.findBoardByNickname(nickname);
    return isyours ? false:true;
  }

  // 게시판 수정
  async updateBoard(
    nickname: string,
    id: string,
    updateBoardRequest: UpdateBoardRequest,
  ): Promise<object | null> {
    const updatedBoard = await this.boardRepository.updateById(
      nickname,
      id,
      updateBoardRequest,
    );
    return updatedBoard;
  }

  // 게시판 삭제
  async deleteBoard(nickname: string, id: string): Promise<string | null> {
    const deletedBoard = await this.boardRepository.deletedById(nickname, id);
    return deletedBoard;
  }

  // 게시판-참여 신청
  async joinBoard(nickname: string, id: string): Promise<object | null> {
    const joinedBoard = await this.boardRepository.joinedBoard(nickname, id);
    return joinedBoard;
  }

  // 게시판-참여 조건 확인
  async checkCount(id: string): Promise<boolean> {
    const board = await this.boardRepository.findBoardForjoin(id);
    const totalCount = board?.participantInfo.totalCount;
    const currentCount = board?.participantInfo.currentCount;
    // 사전 설정된 참여자 수와 현재 신청자 수 비교
    if (totalCount && currentCount) {
      if (totalCount <= currentCount) {
        return true;
      }
    }
    return false;
  }
  // 참여 신청자 중복 여부 확인
  async checkJoinnedList(id: string, nickname: string): Promise<boolean> {
    const board = await this.boardRepository.findBoardForjoin(id);
    const userIdList = board?.participantInfo.userIdList;
    const joinnerName = nickname;
    if (userIdList?.includes(joinnerName)) {
      return true;
    }
    return false;
  }

  async getBoardByOnlyId(id: string): Promise<object | null> {
    const board = await this.boardRepository.findBoardForjoin(id);

    return board;
  }
}
