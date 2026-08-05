import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EmailExistsValidator, UsernameExistsValidator } from './users.validation';
import { BookingsModule } from 'src/bookings/bookings.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  // Import BookingsModule & ReviewsModule so their services are available for injection
  imports: [TypeOrmModule.forFeature([User]), BookingsModule, ReviewsModule],
  controllers: [UsersController],
  providers: [UsersService, EmailExistsValidator, UsernameExistsValidator, { provide: 'UsersService', useClass: UsersService }],
  exports: [UsersService, 'UsersService']
})
export class UsersModule { }