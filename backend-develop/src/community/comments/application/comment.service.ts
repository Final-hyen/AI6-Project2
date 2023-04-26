import { CommentRepository } from '../domain/comment.repository';
import { inject, injectable } from 'inversify';
import { Comments } from '../domain/comment.entity';
import { RegisterCommentRequest } from './dto/request/comment.register.request';
import { UpdateCommentRequest } from './dto/request/comment.update.request';
import { Types } from '../../../app/container/types.di';

@injectable()
export class CommentService {
  constructor(
    @inject(Types.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  // 댓글 생성
  async createComment(
    nickname: string,
    boardId: string,
    registerCommentRequest: RegisterCommentRequest,
  ): Promise<string | null> {
    const createdNewComment = await this.commentRepository.create({
      authorId: nickname,
      boardId: boardId,
      content: registerCommentRequest.content,
    });
    return createdNewComment;
  }

  // 댓글 글자수 제한(200)
  async isMaxContent(content: string): Promise<boolean> {
    return content.length > 200 ? true : false;
  }

  // 게시판 전체 조회
  async findAllComments(
    Id: string,
    page: number,
    limit: number,
  ): Promise<object> {
    const comments = await this.commentRepository.findAllComments(
      Id,
      page,
      limit,
    );
    return comments;
  }

  // 댓글 존재 여부 확인
  async isExistId(id: string): Promise<boolean> {
    const comment = await this.commentRepository.findCommentById(id);
    return comment ? false : true;
  }

  // 댓글에 대한 접근 권한 확인
  async isUserComment(nickname: string): Promise<boolean> {
    const comment = await this.commentRepository.findCommentByNickname(
      nickname,
    );
    return comment ? false : true;
  }
  
  // 댓글 수정
  async updateComment(
    id: string,
    updateCommentRequest: UpdateCommentRequest,
  ): Promise<string | null> {
    const updateComment = await this.commentRepository.updateById(
      id,
      updateCommentRequest,
    );
    return updateComment;
  }

  // 댓글 삭제
  async deleteComment(id: string): Promise<string | null> {
    const deletedBoard = await this.commentRepository.deletedById(id);
    return deletedBoard;
  }
}
