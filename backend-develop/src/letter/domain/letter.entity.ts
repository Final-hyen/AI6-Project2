import { TimestampsEntity } from '../../misc/timestamps.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'letters' })
export class Letter extends TimestampsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index('idx_author_id')
  authorId: number;

  @Column({ type: 'int' })
  @Index('idx_receiver_id')
  receiverId: number;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'boolean', name: 'isDeletedByAuthor' })
  isDeletedByAuthor: boolean;

  @Column({ type: 'boolean', name: 'isDeletedByReceiver' })
  isDeletedByReceiver: boolean;

  constructor(
    authorId: number,
    receiverId: number,
    content: string,
    isDeletedByAuthor: boolean,
    isDeletedByReceiver: boolean,
  ) {
    super();

    this.authorId = authorId;
    this.receiverId = receiverId;
    this.content = content;
    this.isDeletedByAuthor = isDeletedByAuthor;
    this.isDeletedByReceiver = isDeletedByReceiver;
  }

  // 수신자 측에서 삭제 처리를 수행하는 메소드
  deleteByReceiver(): Letter {
    this.isDeletedByReceiver = true;

    this.softDeleteIfCompletelyDeleted();

    return this;
  }

  // 발신자 측에서 삭제 처리를 수행하는 메소드
  deleteByAuthor(): Letter {
    this.isDeletedByAuthor = true;

    this.softDeleteIfCompletelyDeleted();

    return this;
  }

  // 양 측에서 삭제된 경우 완전 삭제 처리를 하는 메소드
  private softDeleteIfCompletelyDeleted() {
    if (this.isDeletedByAuthor === true && this.isDeletedByReceiver) {
      this.deletedAt = new Date();
      this.isDeleted = true;
    }
  }
}
