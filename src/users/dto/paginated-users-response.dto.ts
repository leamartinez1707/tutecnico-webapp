import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from './response-user.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [ResponseUserDto] })
  items: ResponseUserDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
