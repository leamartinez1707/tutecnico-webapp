import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Service } from './service.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectRepository(Service) private servicesRepo: Repository<Service>) {}

  async findAll(): Promise<Service[]> {
    return this.servicesRepo.find({ order: { name: 'ASC' } });
  }
  
  async findAllWithProfessions(): Promise<Service[]> {
    return this.servicesRepo.find({ relations: ['professions'], order: { name: 'ASC' } });
  }

  async findAllPaginated(query: PaginationQueryDto): Promise<{ items: Service[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortField = (query.sort === 'id' || query.sort === 'name') ? query.sort : 'name';
    const order = query.order ?? 'ASC';

    const [items, total] = await this.servicesRepo.findAndCount({
      order: { [sortField]: order as any },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findAllWithProfessionsPaginated(query: PaginationQueryDto): Promise<{ items: Service[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortField = (query.sort === 'id' || query.sort === 'name') ? query.sort : 'name';
    const order = query.order ?? 'ASC';

    const [items, total] = await this.servicesRepo.findAndCount({
      relations: ['professions'],
      order: { [sortField]: order as any },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findOneWithProfessions(id: number): Promise<Service | null> {
    return this.servicesRepo.findOne({ where: { id }, relations: ['professions'] });
  }

  async findOrCreateByNames(names: string[]): Promise<Service[]> {
    const cleaned = Array.from(new Set(names.map(n => (n || '').trim().toLowerCase()).filter(n => !!n)));
    if (!cleaned.length) return [];
    const existing = await this.servicesRepo.find({ where: { name: In(cleaned) } });
    const existingNames = new Set(existing.map(e => e.name));
    const toCreate = cleaned.filter(n => !existingNames.has(n)).map(name => this.servicesRepo.create({ name }));
    if (toCreate.length) {
      const created = await this.servicesRepo.save(toCreate);
      return [...existing, ...created];
    }
    return existing;
  }
}
