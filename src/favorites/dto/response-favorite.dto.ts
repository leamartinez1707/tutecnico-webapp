import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class TechnicianFavoriteSummaryDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  specialization: string;
  @ApiProperty({ type: [String] })
  services: string[];
  @ApiProperty({ required: false, nullable: true })
  profilePhotoUrl?: string | null;
}

export class ResponseFavoriteDto {
  @ApiProperty()
  id: number;
  @ApiProperty({ type: () => TechnicianFavoriteSummaryDto })
  technician: TechnicianFavoriteSummaryDto;
}

export class RemoveFavoriteResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty({ type: () => ResponseFavoriteDto })
  favorite: ResponseFavoriteDto;
}

// Removed local PaginationMetaDto class definition

export class PaginatedFavoritesDto {
  @ApiProperty({ type: [ResponseFavoriteDto] })
  items: ResponseFavoriteDto[];
  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
