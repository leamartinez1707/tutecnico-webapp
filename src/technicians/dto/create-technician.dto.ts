import { IsString, IsNotEmpty, IsEmail, IsArray } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateTechnicianDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsArray()
  @IsNotEmpty()
  services: string[];
}