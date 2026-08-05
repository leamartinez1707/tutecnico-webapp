import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profession } from './profession.entity';

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectRepository(Profession)
    private readonly repo: Repository<Profession>
  ) {}

  findAll(): Promise<Profession[]> {
    return this.repo.find({ relations: ['service'] });
  }

  findByService(serviceId: number): Promise<Profession[]> {
    return this.repo.find({ where: { service: { id: serviceId } }, relations: ['service'] });
  }
}