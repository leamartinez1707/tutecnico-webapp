import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    @IsNumber()
    @IsNotEmpty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    user: number;

    @IsNumber()
    @IsNotEmpty()
    technician: number;
}
