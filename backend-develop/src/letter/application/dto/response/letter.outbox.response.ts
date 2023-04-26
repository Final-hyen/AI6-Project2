export class LetterOutboxResponse {
  id: number;

  authorId: number;

  receiverId: number;

  receiverName: string;

  content: string;

  createdAt: Date;

  constructor(
    id: number,
    authorId: number,
    receiverId: number,
    receiverName: string,
    content: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.authorId = authorId;
    this.receiverId = receiverId;
    this.receiverName = receiverName;
    this.content = content;
    this.createdAt = createdAt;
  }
}
