import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsNumber()
    @IsNotEmpty()
    user: number;

    @IsNumber()
    @IsNotEmpty()
    technician: number;
}
