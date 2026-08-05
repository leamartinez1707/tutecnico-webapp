import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryDto, TechnicianSummaryDto } from 'src/bookings/dto/response-bookings';

export class ResponseReviewDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    rating: number;
    @ApiProperty()
    comment: string;
    @ApiProperty()
    date: Date;
    @ApiProperty({ type: () => UserSummaryDto })
    user: UserSummaryDto;
    @ApiProperty({ type: () => TechnicianSummaryDto })
    technician: TechnicianSummaryDto;
}
