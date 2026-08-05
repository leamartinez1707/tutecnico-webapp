import { Expose, Type, Exclude } from "class-transformer";
import { Booking } from "src/bookings/entities/booking.entity";
import { ResponseTechnicianDto } from "./response-technician.dto";
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseTechnicianBookingsDto extends ResponseTechnicianDto {
    @Expose()
    @Type(() => Booking)
    bookings: Booking[];
}