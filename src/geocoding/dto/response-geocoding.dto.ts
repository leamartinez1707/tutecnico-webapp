import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ResponseGeocodingDTO {
    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsString()
    @IsNotEmpty()
    lng: number;
}
