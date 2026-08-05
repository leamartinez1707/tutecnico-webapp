import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/users/user.entity';
import { Technician } from 'src/technicians/technician.entity';
import { GuardsModule } from 'src/guards/guards.module';
import { TechniciansModule } from 'src/technicians/technicians.module';
import { MembershipGuard } from 'src/guards/membership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Technician]), GuardsModule, forwardRef(() => TechniciansModule)],
  controllers: [ReviewsController],
  providers: [ReviewsService, { provide: 'ReviewsService', useClass: ReviewsService }, MembershipGuard],
  exports: [ReviewsService, 'ReviewsService'],
})
export class ReviewsModule { }
