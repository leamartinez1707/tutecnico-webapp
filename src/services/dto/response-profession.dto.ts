import { ApiProperty } from '@nestjs/swagger';

export class ResponseProfessionDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  description?: string | null;
  @ApiProperty()
  serviceId: number;
  @ApiProperty()
  serviceName: string;
}