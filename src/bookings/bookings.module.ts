import { Module, forwardRef } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Technician } from 'src/technicians/technician.entity';
import { GuardsModule } from 'src/guards/guards.module';
import { TechniciansModule } from 'src/technicians/technicians.module';
import { MembershipGuard } from 'src/guards/membership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Technician]), GuardsModule, forwardRef(() => TechniciansModule)],
  controllers: [BookingsController],
  providers: [BookingsService, { provide: 'BookingsService', useClass: BookingsService }, MembershipGuard],
  exports: [BookingsService, 'BookingsService']
})
export class BookingsModule { }
