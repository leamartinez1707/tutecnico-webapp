import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ description: 'Error type', required: false })
  error?: string;
  @ApiProperty({ description: 'Optional error details', required: false })
  details?: any;
  @ApiProperty({ description: 'Timestamp ISO string' })
  timestamp: string;
  @ApiProperty({ description: 'Request path' })
  path: string;
}