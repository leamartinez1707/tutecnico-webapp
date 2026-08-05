import { ApiProperty } from '@nestjs/swagger';
import { ResponseReviewDto } from './response-review.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedReviewsResponseDto {
  @ApiProperty({ type: [ResponseReviewDto] })
  items: ResponseReviewDto[];
  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
