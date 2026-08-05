import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { User } from '../users/user.entity';
import { Technician } from '../technicians/technician.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>,
  ) { }

  async addFavorite(userId: number, technicianId: number): Promise<Favorite> {
    const existingFavorite = await this.findDuplicate(userId, technicianId);
    if (existingFavorite) {
      throw new NotFoundException('Favorite already exists');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const technician = await this.techniciansRepository.findOne({ where: { id: technicianId } });
    if (!user || !technician) throw new NotFoundException('User or Technician not found');
    const favorite = this.favoritesRepository.create({ user, technician });
    return this.favoritesRepository.save(favorite);
  }

  async removeFavorite(userId: number, technicianId: number): Promise<{ message: string; favorite: Favorite }> {
    const favorite = await this.favoritesRepository.findOne({ where: { user: { id: userId }, technician: { id: technicianId } } });
    if (!favorite) throw new NotFoundException('Favorite not found');
    await this.favoritesRepository.remove(favorite);
    return {
      message: 'Favorite successfully deleted',
      favorite: favorite,
    };
  }

  async getFavorites(userId: number, pagination?: PaginationQueryDto): Promise<{ items: Favorite[]; total: number; page: number; limit: number }> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const sort = pagination?.sort ?? 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';
    const [items, total] = await this.favoritesRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['technician', 'technician.user', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: sort ? { [sort]: order } as any : undefined,
    });
    return { items, total, page, limit };
  }

  async findOne(favoriteId: number): Promise<Favorite> {
    const favorite = await this.favoritesRepository.findOne({ where: { id: favoriteId }, relations: ['user', 'technician'] });
    if (!favorite) throw new NotFoundException('Favorite not found');
    return favorite;
  }

  private async findDuplicate(userId: number, technicianId: number): Promise<Favorite | null> {
    return this.favoritesRepository.findOne({
      where: {
        user: { id: userId },
        technician: { id: technicianId },
      },
    });
  }
}
