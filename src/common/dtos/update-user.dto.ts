import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsString()
  fname: string;

  @IsString()
  lname: string;
}
