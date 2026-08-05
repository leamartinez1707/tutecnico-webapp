import { ApiProperty } from '@nestjs/swagger';

export class PreferenceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  init_point: string;

  @ApiProperty()
  sandbox_init_point: string;

  @ApiProperty({ required: false })
  external_reference?: string;
}
