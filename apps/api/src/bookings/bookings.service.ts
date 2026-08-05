import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Technician } from 'src/technicians/technician.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class BookingsService {

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>
  ) { }

  async create(createBookingDto: CreateBookingDto) {
    const user = await this.usersRepository.findOneBy({ id: createBookingDto.user });
    if (!user) {
      throw new Error('User not found');
    }
    const tech = await this.techniciansRepository.findOneBy({ id: createBookingDto.technician });
    if (!tech) {
      throw new Error('Technician not found');
    }
    const booking = new Booking();
    booking.date = createBookingDto.date;
    booking.status = createBookingDto.status;
    booking.comment = createBookingDto.comment;
    booking.user = user;
    booking.technician = tech;
    return this.bookingsRepository.save(booking);
  }

  async findAll(pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const sort = pagination?.sort ?? 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';
    const [items, total] = await this.bookingsRepository.findAndCount({
      relations: ['user', 'technician'],
      skip: (page - 1) * limit,
      take: limit,
      order: sort ? { [sort]: order } as any : undefined,
    });
    return { items, total, page, limit };
  }

  async findOne(id: number) {
    return await this.bookingsRepository.findOne({ where: { id }, relations: ['user', 'technician'] });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingsRepository.findOneBy({ id });
    if (!booking) {
      throw new HttpException(`Booking with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.bookingsRepository.findOneBy({ id });
    if (!booking) {
      throw new HttpException(`Booking with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return this.bookingsRepository.remove(booking);
  }

  async findByUserUsername(username: string, pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const allowedSort = new Set(['id', 'date', 'status']);
    const sort = allowedSort.has(pagination?.sort || '') ? (pagination?.sort as string) : 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.technician', 'technician')
      .where('user.username = :username', { username })
      .orderBy(`booking.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findByTechnicianUsername(username: string, pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const allowedSort = new Set(['id', 'date', 'status']);
    const sort = allowedSort.has(pagination?.sort || '') ? (pagination?.sort as string) : 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.technician', 'technician')
      .leftJoin('technician.user', 'techUser')
      .where('techUser.username = :username', { username })
      .orderBy(`booking.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }
}
