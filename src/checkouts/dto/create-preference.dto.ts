import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePreferenceDto {
  @ApiProperty({ description: 'ID del técnico que suscribe' })
  @IsNotEmpty()
  @IsNumber()
  technicianId: number;

  @ApiProperty({ description: 'Tipo de plan', enum: ['monthly', 'yearly'], default: 'monthly' })
  @IsNotEmpty()
  @IsString()
  planType: 'monthly' | 'yearly';

  @ApiProperty({ description: 'URL de retorno exitoso', required: false })
  @IsOptional()
  @IsString()
  successUrl?: string;

  @ApiProperty({ description: 'URL de retorno fallido', required: false })
  @IsOptional()
  @IsString()
  failureUrl?: string;

  @ApiProperty({ description: 'URL de pago pendiente', required: false })
  @IsOptional()
  @IsString()
  pendingUrl?: string;
}
