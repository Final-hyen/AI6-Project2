import { Request } from 'express';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterCommentRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string = '';

  static of(req: Request): RegisterCommentRequest {
    const { content } = req.body;

    const registerCommentRequest = new RegisterCommentRequest();
    registerCommentRequest.content = content;

    return registerCommentRequest;
  }
}
