import { Request } from 'express';
import { IsString, MaxLength } from 'class-validator';

export class UpdateBoardRequest {
  @IsString()
  @MaxLength(50)
  title: string = '';

  @IsString()
  @MaxLength(500)
  content: string = '';

  static of(req: Request): UpdateBoardRequest {
    const title: any = req.body.title;
    const content: any = req.body.content;

    const updateBoardRequest = new UpdateBoardRequest();
    updateBoardRequest.title = title;
    updateBoardRequest.content = content;

    return updateBoardRequest;
  }
}
