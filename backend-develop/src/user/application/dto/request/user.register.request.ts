import { BirthDate } from './../../../domain/vo/birthdate.vo';
import { User } from '../../../domain/user.entity';
import { Role } from '../../../domain/enum/role.vo';
import { Gender } from '../../../domain/enum/gender.vo';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  nickname: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  birthDate: BirthDate;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  constructor(email: string, password: string, nickname: string, gender: Gender, birthDate: BirthDate, role = Role.USER) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.gender = gender;
    this.birthDate = birthDate;
    this.role = role;
  }

  // register dto를 user entity로 변환하는 메소드
  toUserEntity() {
    const { email, password, nickname, gender, birthDate, role } = this;

    return new User(email, password, nickname, gender, birthDate, role);
  }
}
