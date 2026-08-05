import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Technician } from 'src/technicians/technician.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ReviewsFilterDto } from './dto/reviews-filter.dto';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>
  ) { }

  async create(createReviewDto: CreateReviewDto) {
    const user = await this.usersRepository.findOneBy({ id: createReviewDto.user });
    if (!user) {
      throw new Error('User not found');
    }
    const tech = await this.techniciansRepository.findOneBy({ id: createReviewDto.technician });
    if (!tech) {
      throw new Error('Technician not found');
    }
    const review = new Review();
    review.rating = createReviewDto.rating;
    review.comment = createReviewDto.comment;
    review.date = createReviewDto.date;
    review.user = user;
    review.technician = tech;
    const saved = await this.reviewsRepository.save(review);
    // Incrementally update technician's average and count
    await this.incrementalAverageOnCreate(tech.id, review.rating);
    return saved;
  }

  async findAll(pagination?: PaginationQueryDto, filters?: ReviewsFilterDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const sort = pagination?.sort ?? 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';
    const qb = this.reviewsRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.technician', 'technician');

    if (filters?.technicianId) qb.andWhere('technician.id = :tId', { tId: filters.technicianId });
    if (filters?.userId) qb.andWhere('user.id = :uId', { uId: filters.userId });
    if (filters?.minRating !== undefined) qb.andWhere('review.rating >= :minRating', { minRating: filters.minRating });
    if (filters?.maxRating !== undefined) qb.andWhere('review.rating <= :maxRating', { maxRating: filters.maxRating });
    if (filters?.fromDate) qb.andWhere('review.date >= :fromDate', { fromDate: filters.fromDate });
    if (filters?.toDate) qb.andWhere('review.date <= :toDate', { toDate: filters.toDate });

    qb.orderBy(`review.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: number) {
    return this.reviewsRepository.findOne({ where: { id }, relations: ['user', 'technician'] });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    // Load existing review with relations to capture current technician
    const review = await this.reviewsRepository.findOne({ where: { id }, relations: ['technician', 'user'] });
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    const previousTechnicianId = review.technician?.id;

    // If technician id is being changed, load the new technician entity
    if (updateReviewDto.technician && updateReviewDto.technician !== previousTechnicianId) {
      const newTech = await this.techniciansRepository.findOneBy({ id: updateReviewDto.technician });
      if (!newTech) {
        throw new HttpException('Technician not found', HttpStatus.BAD_REQUEST);
      }
      review.technician = newTech;
    }

    // If user id is being changed, load the new user entity
    if (updateReviewDto.user && updateReviewDto.user !== review.user?.id) {
      const newUser = await this.usersRepository.findOneBy({ id: updateReviewDto.user });
      if (!newUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      review.user = newUser;
    }

    // Primitive fields
    if (updateReviewDto.rating !== undefined) review.rating = updateReviewDto.rating;
    if (updateReviewDto.comment !== undefined) review.comment = updateReviewDto.comment;
    if (updateReviewDto.date !== undefined) review.date = updateReviewDto.date;

    const saved = await this.reviewsRepository.save(review);

    // Incremental average updates
    const newTechId = review.technician.id;
    if (previousTechnicianId && previousTechnicianId !== newTechId) {
      // Moved review: remove from previous technician, add to new
      await this.incrementalAverageOnDelete(previousTechnicianId, (updateReviewDto as any)._oldRating ?? review.rating);
      await this.incrementalAverageOnCreate(newTechId, review.rating);
    } else if (updateReviewDto.rating !== undefined) {
      // Rating changed, adjust within same technician
      const oldRating = (updateReviewDto as any)._oldRating ?? review.rating;
      const newRating = updateReviewDto.rating;
      await this.incrementalAverageOnUpdate(newTechId, oldRating, newRating);
    }

    return saved;
  }

  async remove(id: number) {
    const review = await this.reviewsRepository.findOne({ where: { id }, relations: ['technician'] });
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    const technicianId = review.technician?.id;
    const removed = await this.reviewsRepository.remove(review);
    if (technicianId) {
      await this.incrementalAverageOnDelete(technicianId, review.rating);
    }
    return removed;
  }

  async findByUserUsername(username: string, pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const allowedSort = new Set(['id', 'date', 'rating']);
    const sort = allowedSort.has(pagination?.sort || '') ? (pagination?.sort as string) : 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.technician', 'technician')
      .where('user.username = :username', { username })
      .orderBy(`review.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findByTechnicianUsername(username: string, pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const allowedSort = new Set(['id', 'date', 'rating']);
    const sort = allowedSort.has(pagination?.sort || '') ? (pagination?.sort as string) : 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.technician', 'technician')
      .leftJoin('technician.user', 'techUser')
      .where('techUser.username = :username', { username })
      .orderBy(`review.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  private async updateTechnicianAverage(technicianId: number) {
    const raw = await this.reviewsRepository
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .where('r.technicianId = :id', { id: technicianId })
      .getRawOne<{ avg: string | number | null }>();
    const value = raw?.avg == null ? 0 : Number(parseFloat(String(raw.avg)).toFixed(2));
    await this.techniciansRepository.update({ id: technicianId }, { averageRating: value as any });
  }

  // Incremental formulas use reviewsCount to avoid full AVG scans
  private async incrementalAverageOnCreate(technicianId: number, rating: number) {
    const tech = await this.techniciansRepository.findOneBy({ id: technicianId });
    if (!tech) return;
    const n = tech.reviewsCount ?? 0;
    const newAvg = Number((((tech.averageRating || 0) * n + rating) / (n + 1)).toFixed(2));
    await this.techniciansRepository.update({ id: technicianId }, { averageRating: newAvg as any, reviewsCount: n + 1 });
  }

  private async incrementalAverageOnUpdate(technicianId: number, oldRating: number, newRating: number) {
    if (oldRating === newRating) return;
    const tech = await this.techniciansRepository.findOneBy({ id: technicianId });
    if (!tech) return;
    const n = tech.reviewsCount ?? 0;
    if (n <= 0) return; // safety
    const newAvg = Number(((tech.averageRating * n - oldRating + newRating) / n).toFixed(2));
    await this.techniciansRepository.update({ id: technicianId }, { averageRating: newAvg as any });
  }

  private async incrementalAverageOnDelete(technicianId: number, rating: number) {
    const tech = await this.techniciansRepository.findOneBy({ id: technicianId });
    if (!tech) return;
    const n = tech.reviewsCount ?? 0;
    if (n <= 1) {
      await this.techniciansRepository.update({ id: technicianId }, { averageRating: 0 as any, reviewsCount: 0 });
      return;
    }
    const newAvg = Number(((tech.averageRating * n - rating) / (n - 1)).toFixed(2));
    await this.techniciansRepository.update({ id: technicianId }, { averageRating: newAvg as any, reviewsCount: n - 1 });
  }
}
