import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Request } from 'express';

export class UserLoginRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
