import { ApiProperty } from '@nestjs/swagger';

export class WebhookPaymentDto {
  @ApiProperty({ required: false })
  action?: string;

  @ApiProperty({ required: false })
  api_version?: string;

  @ApiProperty({ required: false })
  data?: {
    id: string;
  };

  @ApiProperty({ required: false })
  date_created?: string;

  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  live_mode?: boolean;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  user_id?: string;
}
