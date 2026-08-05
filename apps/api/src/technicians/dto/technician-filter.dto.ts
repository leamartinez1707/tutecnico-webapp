import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { MembershipType } from '../technician.entity';

export class TechnicianFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar por especialización exacta' })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({ description: 'Filtrar por tipo de membresía', enum: MembershipType })
  @IsOptional()
  @IsIn(Object.values(MembershipType))
  membershipType?: MembershipType;

  @ApiPropertyOptional({ description: 'Solo técnicos con membresía activa', default: undefined })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  membershipActive?: boolean;

  @ApiPropertyOptional({ description: 'Nombre de servicio (normalizado a lowercase)' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiPropertyOptional({ description: 'Rating mínimo (promedio)', example: 4 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiPropertyOptional({ description: 'Rating máximo (promedio)', example: 5 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxRating?: number;
}
