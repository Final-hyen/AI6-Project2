import { User } from './../../../domain/user.entity';
import { IsOptional, IsString, Length } from 'class-validator';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

export class UserUpdateRequest {
  @IsOptional()
  @IsString()
  @Length(1)
  password?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  nickname?: string;

  constructor(password?: string, nickname?: string) {
    this.password = password;
    this.nickname = nickname;
  }

  static of(req: Request): UserUpdateRequest {
    const updateRequest = new UserUpdateRequest();

    const { password, nickname } = req.body;

    updateRequest.password = password;
    updateRequest.nickname = nickname;

    return updateRequest;
  }

  // updateRequest의 password를 암호화하는 메소드
  async encryptPassword(): Promise<void> {
    this.password = this.password ? await bcrypt.hash(this.password!, 10) : this.password;
  }
}
