import { Letter } from '../../../domain/letter.entity';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class LetterCreateRequest {
  @IsNumber()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  content: string;

  constructor(receiverId: number, content: string) {
    this.receiverId = receiverId;
    this.content = content;
  }

  toEntity(authorId: number): Letter {
    const { receiverId, content } = this;
    return new Letter(authorId, receiverId, content, false, false);
  }
}
