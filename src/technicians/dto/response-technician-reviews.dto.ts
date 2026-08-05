import { Exclude, Expose, Type } from "class-transformer";
import { Review } from "src/reviews/entities/review.entity";
import { ResponseTechnicianDto } from "./response-technician.dto";
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseTechnicianReviewsDto extends ResponseTechnicianDto {
    @Expose()
    @Type(() => Review)
    reviews: Review[];
}