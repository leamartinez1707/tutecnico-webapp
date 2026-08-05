import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CheckoutsController } from './checkouts.controller';
import { CheckoutsService } from './checkouts.service';
import { Payment } from './entities/payment.entity';
import { PaymentProof } from './entities/payment-proof.entity';
import { Technician } from 'src/technicians/technician.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentProof, Technician]),
    ConfigModule,
  ],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
  exports: [CheckoutsService],
})
export class CheckoutsModule {}
