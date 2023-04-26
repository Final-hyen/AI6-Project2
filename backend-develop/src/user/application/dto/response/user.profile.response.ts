import { User } from './../../../domain/user.entity';
import { BirthDate } from './../../../domain/vo/birthdate.vo';

export class UserProfileResponse {
  id: number;

  email: string;

  nickname: string;

  gender: string;

  birthDate: BirthDate;

  constructor(id: number, email: string, nickname: string, gender: string, birthDate: BirthDate) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.gender = gender;
    this.birthDate = birthDate;
  }

  // 엔티티를 response 객체로 변환하는 정적 메소드
  static fromEntity(user: User): UserProfileResponse {
    const { id, email, nickname, gender, birthDate } = user;

    return new UserProfileResponse(id, email, nickname, gender, birthDate);
  }
}
