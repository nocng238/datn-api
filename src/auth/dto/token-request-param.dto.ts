import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailRequestParamDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
