import { Boards } from './board.entity';
import { injectable } from 'inversify';
import { BoardsTypes } from './board.entity';

@injectable()
export class BoardRepository {
  async create(
    nickname: string | null,
    boardInfo: {
      title: string;
      content: string;
      totalCount: number;
    },
    sub: string
  ): Promise<BoardsTypes> {
    const { title, content, totalCount } = boardInfo;
    const createdNewBoard = await Boards.create({
      authorId: nickname,
      title: title,
      content: content,
      'participantInfo.totalCount': totalCount,
      'participantInfo.userIdList': nickname,
      userId: sub
    });
    const result: BoardsTypes = {
      _id: createdNewBoard._id,
      title: createdNewBoard.title,
      content: createdNewBoard.content,
      participantInfo: createdNewBoard.participantInfo,
    };
    return result;
  }

  async findAllBoards(page: number, limit: number): Promise<object> {
    const totalPage = await Boards.countDocuments({ isDeleted: false });
    const boards = await Boards.find({ isDeleted: false })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createdAt: -1 });

    const result = { totalPage: totalPage, boards: boards };

    return result;
  }

  async findBoardBool(id: string): Promise<BoardsTypes | undefined> {
    const board = await Boards.findOne({ _id: id, isDeleted: false });
    if (!board) {
      return;
    }
    return board;
  }

  async findBoardForjoin(id: string): Promise<BoardsTypes | null> {
    const board = await Boards.findOne({ _id: id });
    if (!board) {
      return null;
    }
    const result: BoardsTypes = {
      _id: board._id,
      title: board.title,
      content: board.content,
      participantInfo: board.participantInfo,
    };
    return result;
  }

  async findBoardById(id: string): Promise<BoardsTypes | null> {
    const board = await Boards.findOne({ _id: id });
    if (!board) {
      return null;
    }
    const result: BoardsTypes = {
      _id: board._id,
      title: board.title,
      content: board.content,
      participantInfo: board.participantInfo,
      authorId: board.authorId,
      createdAt: board.createdAt,
      userId: board.userId
    };

    return result;
  }

  async findBoardByNickname(nickname: string): Promise<BoardsTypes | null> {
    const Isyours = await Boards.findOne({ authorId: nickname });
    if (!Isyours) {
      return null;
    }
    const result: BoardsTypes = {
      _id: Isyours._id,
      title: Isyours.title,
      content: Isyours.content,
      participantInfo: Isyours.participantInfo,
    };
    return result;
  }

  async updateById(
    nickname: string | null,
    id: string,
    updated: { title?: string; content?: string },
  ): Promise<BoardsTypes | null> {
    const filt = { _id: id, authorId: nickname };
    const option = { returnOriginal: false };
    const updatedBoard = await Boards.findOneAndUpdate(
      filt,
      { title: updated.title, content: updated.content },
      option,
    );
    if (!updatedBoard) {
      return null;
    }
    const result: BoardsTypes = {
      _id: updatedBoard._id,
      title: updatedBoard.title,
      content: updatedBoard.content,
      participantInfo: updatedBoard.participantInfo,
    };
    return result;
  }

  async deletedById(nickname: string, id: string): Promise<string | null> {
    const filt = { _id: id, authorId: nickname };
    const option = { returnOriginal: false }; // false-> 바로 출력
    const deletedAndupdate = await Boards.findOneAndUpdate(
      filt,
      {
        $unset: {
          title: '',
          content: '',
          authorId: '',
          createdAt: '',
          participantInfo: '',
        },
        $set: { deletedAt: Date.now(), isDeleted: true },
      },
      option,
    );
    if (!deletedAndupdate) {
      return null;
    }
    return 'Ok';
  }

  async joinedBoard(nickname: string, id: string): Promise<BoardsTypes | null> {
    const filt = { _id: id };
    const option = { returnOriginal: false };
    const joinedBoard = await Boards.findOneAndUpdate(
      filt,
      {
        $inc: {
          'participantInfo.currentCount': 1,
        },
        $push: {
          'participantInfo.userIdList': nickname,
        },
      },
      option,
    );
    if (!joinedBoard) {
      return null;
    }
    const result: BoardsTypes = {
      _id: joinedBoard._id,
      title: joinedBoard.title,
      content: joinedBoard.content,
      participantInfo: joinedBoard.participantInfo,
    };
    return result;
  }
}
const boardRepository = new BoardRepository();
export { boardRepository };
