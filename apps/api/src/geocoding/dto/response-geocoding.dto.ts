import { IsNotEmpty, IsNumber } from "class-validator";

export class ResponseGeocodingDTO {
    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsNumber()
    @IsNotEmpty()
    lng: number;
}
