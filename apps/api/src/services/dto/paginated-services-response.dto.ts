import { ApiProperty } from '@nestjs/swagger';
import { ResponseServiceDto } from './response-service.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedServicesResponseDto {
  @ApiProperty({ type: [ResponseServiceDto] })
  items: ResponseServiceDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
