import { Request } from 'express';
import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateCommentRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string = '';

  static of(req: Request): UpdateCommentRequest {
    const { content } = req.body;

    const updateCommentRequest = new UpdateCommentRequest();
    updateCommentRequest.content = content;

    return updateCommentRequest;
  }
}
