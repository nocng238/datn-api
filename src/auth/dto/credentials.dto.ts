import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Credentials {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
