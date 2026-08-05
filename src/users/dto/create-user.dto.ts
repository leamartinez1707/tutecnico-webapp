import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsEmailExists, IsUsernameExists } from '../users.validation';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsUsernameExists()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmailExists()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  profilePhotoUrl?: string;
}