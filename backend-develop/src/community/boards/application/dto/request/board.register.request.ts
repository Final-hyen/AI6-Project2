import { Request } from 'express';

import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class RegisterBoardRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string = '';

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(8)
  totalCount: number;

  static of(req: Request): RegisterBoardRequest {
    const { title, content, totalCount } = req.body;

    const registerBoardRequest = new RegisterBoardRequest();
    registerBoardRequest.title = title;
    registerBoardRequest.content = content;
    registerBoardRequest.totalCount = totalCount;

    return registerBoardRequest;
  }
}
