import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class TimestampsEntity extends BaseEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date | null = null;

  // 기본 값은 null로 설정
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;

  // 기본 값은 false로 설정
  @Column({ type: 'boolean' })
  isDeleted: boolean = false;
}
