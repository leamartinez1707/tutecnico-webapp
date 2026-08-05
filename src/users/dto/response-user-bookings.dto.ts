import { ResponseUserDto } from './response-user.dto';
import { ResponseBookingsDto } from 'src/bookings/dto/response-bookings';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserBookingsDto extends ResponseUserDto {
  @ApiProperty({ type: [ResponseBookingsDto] })
  bookings: ResponseBookingsDto[];
}