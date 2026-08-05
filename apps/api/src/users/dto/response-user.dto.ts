import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ example: 'jdoe' })
  username: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '+59899123456' })
  phone: string;

  @ApiProperty({ example: 'Av. Siempre Viva 742' })
  address: string;

  @ApiProperty({ required: false, nullable: true, example: 'https://cdn.example.com/u/123.png' })
  profilePhotoUrl?: string | null;
}