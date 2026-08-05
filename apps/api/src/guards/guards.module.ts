// src/guards/guards.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Technician } from 'src/technicians/technician.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Favorite } from 'src/favorites/favorite.entity';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Technician,
      Review,
      Booking,
      Favorite
    ]),
  ],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class GuardsModule {}
