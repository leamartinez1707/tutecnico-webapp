import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { Profession } from './profession.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ProfessionsService } from './professions.service';
import { ProfessionsController } from './professions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Profession])],
  controllers: [ServicesController, ProfessionsController],
  providers: [ServicesService, ProfessionsService],
  exports: [ServicesService, ProfessionsService]
})
export class ServicesModule {}
