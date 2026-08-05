import { Module, forwardRef } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './technician.entity';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { GuardsModule } from 'src/guards/guards.module';
import { User } from 'src/users/user.entity';
import { BookingsModule } from 'src/bookings/bookings.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { ServicesModule } from 'src/services/services.module';

@Module({
  // Import BookingsModule & ReviewsModule so their services can be injected in TechniciansController
  imports: [TypeOrmModule.forFeature([Technician, User]), GeocodingModule, GuardsModule, forwardRef(() => BookingsModule), forwardRef(() => ReviewsModule), ServicesModule],
  controllers: [TechniciansController],
  providers: [TechniciansService, { provide: 'TechniciansService', useClass: TechniciansService }],
  exports: [TechniciansService, 'TechniciansService']
})
export class TechniciansModule { }