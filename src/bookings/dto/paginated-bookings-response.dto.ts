import { ApiProperty } from '@nestjs/swagger';
import { ResponseBookingsDto } from './response-bookings';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedBookingsResponseDto {
  @ApiProperty({ type: [ResponseBookingsDto] })
  items: ResponseBookingsDto[];
  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
