import { ResponseUserDto } from './response-user.dto';
import { ResponseReviewDto } from 'src/reviews/dto/response-review.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserReviewsDto extends ResponseUserDto {
  @ApiProperty({ type: [ResponseReviewDto] })
  reviews: ResponseReviewDto[];
}