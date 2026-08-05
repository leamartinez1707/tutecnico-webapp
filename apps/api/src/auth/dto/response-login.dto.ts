import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';

export class ResponseLoginDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNotEmpty()
  user: Object;
}