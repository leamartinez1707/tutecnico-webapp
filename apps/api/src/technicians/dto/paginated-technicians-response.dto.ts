import { ApiProperty } from '@nestjs/swagger';
import { ResponseTechnicianDto } from './response-technician.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedTechniciansResponseDto {
  @ApiProperty({ type: [ResponseTechnicianDto] })
  items: ResponseTechnicianDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
