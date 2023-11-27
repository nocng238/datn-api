import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  newPassword: string;
}
