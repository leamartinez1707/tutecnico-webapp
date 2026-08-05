import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<{ success: boolean; message: string; user?: ResponseUserDto }> {
    await this.validateUniqueFields(createUserDto.username, createUserDto.email, createUserDto.phone);

    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
  const newUser = this.usersRepository.create({ ...createUserDto, role: UserRole.USUARIO });
    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...userResponse } = savedUser;

    return { success: true, message: 'User successfully created', user: userResponse };
  }

  async findAll(pagination?: PaginationQueryDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const sort = pagination?.sort ?? 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';
    const [items, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: sort ? { [sort]: order } as any : undefined,
    });
    return { items, total, page, limit };
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username
      }
    });
  }

  async findBookings(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username
      },
      relations: ['bookings', 'bookings.user', 'bookings.technician']
    });
  }

  async findReviews(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username
      },
      relations: ['reviews', 'reviews.user', 'reviews.technician']
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Empty update data provided');
    }
    await this.validateUniqueFields(updateUserDto.username, updateUserDto.email, updateUserDto.phone, id);

    // Hash password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    const { password, ...userResponse } = updatedUser;
    return userResponse;
  }

  async remove(id: number): Promise<{ message: string; user: ResponseUserDto }> {
    const userToDelete = await this.usersRepository.findOne({ where: { id } });
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...userResponse } = userToDelete;
    await this.usersRepository.delete(id);

    return {
      message: 'User successfully deleted',
      user: userResponse,
    };
  }

  async validateUniqueFields(username: string | undefined, email: string | undefined, phone: string | undefined, userId?: number): Promise<void> {
    const conditions: { username?: string; email?: string; phone?: string }[] = [];
    if (username) conditions.push({ username });
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    if (conditions.length === 0) return;

    const existingUser = await this.usersRepository.findOne({
      where: conditions,
    });

    if (existingUser && existingUser.id !== userId) {
      if (username && existingUser.username === username) {
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }
      if (email && existingUser.email === email) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      if (phone && existingUser.phone === phone) {
        throw new HttpException('Phone already exists', HttpStatus.CONFLICT);
      }
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}