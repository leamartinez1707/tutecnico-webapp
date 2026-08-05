import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReviewsFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar por id de técnico' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  technicianId?: number;

  @ApiPropertyOptional({ description: 'Filtrar por id de usuario' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ description: 'Rating mínimo', example: 3 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Rating máximo', example: 5 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxRating?: number;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO string)' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO string)' })
  @IsOptional()
  @IsString()
  toDate?: string;
}
