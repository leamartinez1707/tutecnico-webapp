import { ApiProperty } from '@nestjs/swagger';

export class ResponseServiceDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  description?: string | null;
  
  @ApiProperty({ required: false, type: () => [Object] })
  professions?: { id: number; name: string; description?: string | null }[];
}
