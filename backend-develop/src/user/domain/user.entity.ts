import { BirthDate } from './vo/birthdate.vo';
import { TimestampsEntity } from './../../misc/timestamps.entity';
import { Role } from './enum/role.vo';
import { Gender } from './enum/gender.vo';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends TimestampsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  nickname: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column(() => BirthDate)
  birthDate: BirthDate;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  constructor(
    email: string,
    password: string,
    nickname: string,
    gender: Gender,
    birthDate: BirthDate,
    role: Role,
  ) {
    super();

    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.gender = gender;
    this.birthDate = birthDate;
    this.role = role;
  }

  // soft-delete 정책에 의해 User를 삭제하는 메소드
  softDelete(): User {
    this.deletedAt = new Date();
    this.isDeleted = true;

    return this;
  }
}
