import { Letter } from '../../../domain/letter.entity';

export class LetterCreateResponse {
  id: number;

  authorId: number;

  receiverId: number;

  content: string;

  constructor(
    id: number,
    authorId: number,
    receiverId: number,
    content: string,
  ) {
    this.id = id;
    this.authorId = authorId;
    this.receiverId = receiverId;
    this.content = content;
  }

  static fromEntity(letter: Letter): LetterCreateResponse {
    const { id, authorId, receiverId, content } = letter;

    return new LetterCreateResponse(id, authorId, receiverId, content);
  }
}
