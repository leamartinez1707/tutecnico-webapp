import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsIn, Min } from 'class-validator';

export class CreatePaymentProofDto {
  @ApiProperty({ description: 'Tipo de membresía', enum: ['TRIAL', 'PAID'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['TRIAL', 'PAID'])
  membershipType: string;

  @ApiProperty({ description: 'Referencia de la transacción bancaria' })
  @IsNotEmpty()
  @IsString()
  transactionReference: string;

  @ApiProperty({ description: 'Fecha de la transacción (ISO 8601)' })
  @IsNotEmpty()
  @IsDateString()
  transactionDate: string;

  @ApiProperty({ description: 'Monto de la transferencia', minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Cuenta bancaria desde la que se transfirió' })
  @IsNotEmpty()
  @IsString()
  bankAccount: string;
}
