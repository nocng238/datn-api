import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorNote {
  @IsString()
  @IsNotEmpty()
  note: string;
}
