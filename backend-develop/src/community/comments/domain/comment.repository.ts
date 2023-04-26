import { Comments } from './comment.entity';
import { injectable } from 'inversify';

@injectable()
export class CommentRepository {
  async create(commentInfo: {
    authorId: string;
    boardId: string;
    content: string;
  }): Promise<string | null> {
    const authorId: string = commentInfo.authorId;
    const content: string = commentInfo.content;
    const boardId: string = commentInfo.boardId;
    const createdNewComment = await Comments.create({
      authorId,
      content,
      boardId,
    });
    if (!createdNewComment) {
      return null;
    }
    return 'Ok';
  }

  async findAllComments(
    Id: string,
    page: number,
    limit: number,
  ): Promise<object> {
    const totalPage = await Comments.countDocuments({
      boardId: Id,
      isDeleted: false,
    });
    const comments = await Comments.find({ boardId: Id, isDeleted: false })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createdAt: 1 });

    const result = { totalPage: totalPage, comments: comments };
    return result;
  }

  async findCommentById(id: string): Promise<object | null> {
    const comment = await Comments.findOne({ _id: id });
    if (!comment) {
      return null;
    }
    if (comment.isDeleted == true) {
      return null;
    }
    return comment;
  }

  async findCommentByNickname(nickname: string): Promise<object | null> {
    const comment = await Comments.findOne({ authorId: nickname });
    if (!comment) {
      return null;
    }
    if (comment.isDeleted == true) {
      return null;
    }
    return comment;
  }

  async updateById(
    id: string,
    updated: { content: string },
  ): Promise<string | null> {
    const filt = { _id: id };
    const option = { returnOriginal: false };

    const updatedComment = await Comments.findOneAndUpdate(
      filt,
      { content: updated.content },
      option,
    );
    if (!updatedComment) {
      return null;
    }
    return 'Ok';
  }

  async deletedById(id: string): Promise<string | null> {
    const comment = await Comments.findOne({ _id: id });
    if (!comment) {
      return null;
    }
    const filt = { _id: id };
    const option = { returnOriginal: false }; // false-> 바로 출력
    const deletedAndupdate = await Comments.findOneAndUpdate(
      filt,
      {
        $unset: {
          content: '',
          authorId: '',
          createdAt: '',
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
}
const commentRepository = new CommentRepository();
export { commentRepository };
