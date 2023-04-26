export class LetterInboxResponse {
  id: number;

  authorId: number;

  authorName: string;

  receiverId: number;

  content: string;

  createdAt: Date;

  constructor(
    id: number,
    authorId: number,
    authorName: string,
    receiverId: number,
    content: string,
    createdAt: Date
  ) {
    this.id = id;
    this.authorId = authorId;
    this.authorName = authorName;
    this.receiverId = receiverId;
    this.content = content;
    this.createdAt = createdAt;
  }
}
