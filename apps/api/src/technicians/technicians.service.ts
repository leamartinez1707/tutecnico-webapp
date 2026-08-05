import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { Repository } from 'typeorm';
import { Technician, MembershipType } from './technician.entity'
import { Service } from '../services/service.entity';
import { ServicesService } from '../services/services.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import * as bcrypt from 'bcrypt';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseTechnicianDto } from './dto/response-technician.dto';
import { validateUniqueUserFields } from 'src/utils/valida-unique-fields';
import { Cron } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TechnicianFilterDto } from './dto/technician-filter.dto';
import { Payment } from 'src/checkouts/entities/payment.entity';
import { PaymentProof, PaymentProofStatus } from 'src/checkouts/entities/payment-proof.entity';
import { CreatePaymentProofDto } from './dto/create-payment-proof.dto';

export interface MembershipHistoryItem {
  type: 'mercadopago' | 'manual';
  createdAt: Date;
  amount: number;
  status: string;
  planType?: string;
  membershipType?: string;
  transactionReference?: string;
}

@Injectable()
export class TechniciansService {

  constructor(
    @InjectRepository(Technician)
    private techniciansRepository: Repository<Technician>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentProof)
    private paymentProofRepository: Repository<PaymentProof>,
    private geocodingService: GeocodingService,
    private servicesService: ServicesService
  ) { }

  async create(createTechnicianDto: CreateTechnicianDto) {
    await validateUniqueUserFields(
      this.usersRepository,
      createTechnicianDto.username,
      createTechnicianDto.email,
      createTechnicianDto.phone
    );

    const user = new User();
    user.username = createTechnicianDto.username;
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(createTechnicianDto.password, salt);
    user.email = createTechnicianDto.email;
    user.firstName = createTechnicianDto.firstName;
    user.lastName = createTechnicianDto.lastName;
    user.phone = createTechnicianDto.phone;
    user.address = createTechnicianDto.address;
    user.role = UserRole.TECNICO;

    const technician = new Technician();
    technician.specialization = createTechnicianDto.specialization;
    technician.services = await this.servicesService.findOrCreateByNames(createTechnicianDto.services || []);

    const map = await this.geocodingService.getCoordinates(createTechnicianDto.address);
    technician.latitude = map.lat;
    technician.longitude = map.lng;

    technician.user = user;
    // Membership: first 10 registered technicians get 1-month free trial
    const total = await this.techniciansRepository.count();
    if (total < 10) {
      const now = new Date();
      technician.membershipType = MembershipType.TRIAL;
      technician.membershipActive = true;
      technician.membershipStartedAt = now;
      technician.membershipExpiresAt = this.addMonths(now, 1);
    } else {
      technician.membershipType = MembershipType.NONE;
      technician.membershipActive = false;
      technician.membershipStartedAt = null;
      technician.membershipExpiresAt = null;
    }

    const newTechnician = this.techniciansRepository.save(technician);

    return newTechnician;
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    // handle month rollover (e.g., Jan 31 + 1 month)
    if (d.getDate() < day) {
      d.setDate(0); // last day of previous month
    }
    return d;
  }

  // Run daily at midnight to avoid delayed expirations
  @Cron('0 0 0 * * *')
  async handleMonthlyMembershipExpirationCheck() {
    await this.runMembershipExpirationCheck();
  }

  async runMembershipExpirationCheck(): Promise<number> {
    const now = new Date();
    const toExpire = await this.techniciansRepository.find({
      where: {
        membershipActive: true,
        membershipExpiresAt: LessThan(now),
      },
      select: ['id', 'membershipType', 'membershipActive', 'membershipExpiresAt'],
    });

    if (!toExpire.length) return 0;

    for (const t of toExpire) {
      t.membershipActive = false;
      t.membershipType = MembershipType.NONE; // reset type when expired
    }

    await this.techniciansRepository.save(toExpire);
    return toExpire.length;
  }

  // Optional helper to activate paid membership for N months
  async activatePaidMembership(technicianId: number, months = 1): Promise<Technician> {
    const t = await this.techniciansRepository.findOne({ where: { id: technicianId } });
    if (!t) throw new NotFoundException('Technician not found');

    const now = new Date();
    const start = t.membershipActive && t.membershipExpiresAt && t.membershipExpiresAt > now
      ? t.membershipExpiresAt
      : now;

    t.membershipType = MembershipType.PAID;
    t.membershipActive = true;
    t.membershipStartedAt = t.membershipStartedAt ?? now;
    t.membershipExpiresAt = this.addMonths(start, months);

    return this.techniciansRepository.save(t);
  }

  async findAll(pagination?: PaginationQueryDto, filters?: TechnicianFilterDto): Promise<{ items: Technician[]; total: number; page: number; limit: number }> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const sort = pagination?.sort ?? 'id';
    const order = (pagination?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.techniciansRepository.createQueryBuilder('technician')
      .leftJoinAndSelect('technician.user', 'user')
      .leftJoinAndSelect('technician.services', 'service');

    if (filters?.specialization) {
      qb.andWhere('technician.specialization ILIKE :spec', { spec: filters.specialization });
    }
    if (filters?.membershipType) {
      qb.andWhere('technician.membershipType = :mt', { mt: filters.membershipType });
    }
    if (filters?.membershipActive !== undefined) {
      qb.andWhere('technician.membershipActive = :ma', { ma: filters.membershipActive });
    }
    if (filters?.service) {
      qb.andWhere('service.name = :sv', { sv: filters.service.toLowerCase() });
    }
    // Rating filters require join with reviews
    if (filters?.minRating !== undefined || filters?.maxRating !== undefined) {
      qb.leftJoin('technician.reviews', 'review');
      qb.addSelect('AVG(review.rating)', 'avgRating');
      qb.groupBy('technician.id');
      qb.addGroupBy('user.id');
      qb.addGroupBy('service.id');
      if (filters?.minRating !== undefined) {
        qb.having('AVG(review.rating) >= :minRating', { minRating: filters.minRating });
      }
      if (filters?.maxRating !== undefined) {
        qb.andHaving('AVG(review.rating) <= :maxRating', { maxRating: filters.maxRating });
      }
    }

    qb.orderBy(`technician.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: number): Promise<Technician | null> {
    return this.techniciansRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<Technician | null> {
    const tech = await this.techniciansRepository.findOne({
      where: { user: { username } },
      relations: ['user', 'services']
    });
    return tech
  }

  async findBookings(username: string): Promise<Technician | null> {
    const tech = await this.techniciansRepository.findOne({
      where: { user: { username } },
      relations: ['user', 'bookings', 'bookings.user', 'bookings.technician']
    });
    return tech
  }

  async findReviews(username: string): Promise<Technician | null> {
    const tech = await this.techniciansRepository.findOne({
      where: { user: { username } },
      relations: ['user', 'reviews', 'reviews.user', 'reviews.technician']
    });
    return tech
  }

  async update(id: number, updateTechnicianDto: UpdateTechnicianDto): Promise<Technician> {
    const technician = await this.techniciansRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!technician) {
      throw new HttpException('Technician not found', HttpStatus.NOT_FOUND);
    }

    if (!updateTechnicianDto || Object.keys(updateTechnicianDto).length === 0) {
      throw new BadRequestException('Empty update data provided');
    }

    await validateUniqueUserFields(
      this.usersRepository,
      updateTechnicianDto.username,
      updateTechnicianDto.email,
      updateTechnicianDto.phone,
      technician.user.id
    );

    if (updateTechnicianDto.specialization) {
      technician.specialization = updateTechnicianDto.specialization;
    }
    if (updateTechnicianDto.services) {
      technician.services = await this.servicesService.findOrCreateByNames(updateTechnicianDto.services);
    }
    if (updateTechnicianDto.latitude) {
      technician.latitude = updateTechnicianDto.latitude;
    }
    if (updateTechnicianDto.longitude) {
      technician.longitude = updateTechnicianDto.longitude;
    }

    if (updateTechnicianDto.username) {
      technician.user.username = updateTechnicianDto.username;
    }
    if (updateTechnicianDto.email) {
      technician.user.email = updateTechnicianDto.email;
    }
    if (updateTechnicianDto.phone) {
      technician.user.phone = updateTechnicianDto.phone;
    }
    if (updateTechnicianDto.firstName) {
      technician.user.firstName = updateTechnicianDto.firstName;
    }
    if (updateTechnicianDto.lastName) {
      technician.user.lastName = updateTechnicianDto.lastName;
    }
    if (updateTechnicianDto.address) {
      technician.user.address = updateTechnicianDto.address;
    }

    if (updateTechnicianDto.profilePhotoUrl) {
      technician.user.profilePhotoUrl = updateTechnicianDto.profilePhotoUrl;
    }

    return this.techniciansRepository.save(technician);
  }

  async findMembershipStatus(technicianId: number): Promise<{
    membershipType: string;
    membershipActive: boolean;
    membershipStartedAt: Date | null;
    membershipExpiresAt: Date | null;
  }> {
    const technician = await this.techniciansRepository.findOne({
      where: { id: technicianId },
      select: ['id', 'membershipType', 'membershipActive', 'membershipStartedAt', 'membershipExpiresAt'],
    });

    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    return {
      membershipType: technician.membershipType,
      membershipActive: technician.membershipActive,
      membershipStartedAt: technician.membershipStartedAt,
      membershipExpiresAt: technician.membershipExpiresAt,
    };
  }

  async submitPaymentProof(technicianId: number, dto: CreatePaymentProofDto): Promise<PaymentProof> {
    const technician = await this.techniciansRepository.findOne({ where: { id: technicianId } });
    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    const proof = this.paymentProofRepository.create({
      membershipType: dto.membershipType,
      transactionReference: dto.transactionReference,
      transactionDate: new Date(dto.transactionDate),
      amount: dto.amount,
      bankAccount: dto.bankAccount,
      status: PaymentProofStatus.PENDING,
      technician,
    });

    return this.paymentProofRepository.save(proof);
  }

  async findMembershipHistory(technicianId: number, page = 1, limit = 20): Promise<{
    items: MembershipHistoryItem[];
    meta: { total: number; page: number; limit: number };
  }> {
    const technician = await this.techniciansRepository.findOne({ where: { id: technicianId } });
    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    const [payments, proofs] = await Promise.all([
      this.paymentRepository.find({
        where: { technician: { id: technicianId } },
        order: { createdAt: 'DESC' },
      }),
      this.paymentProofRepository.find({
        where: { technician: { id: technicianId } },
        order: { createdAt: 'DESC' },
      }),
    ]);

    const mercadopagoItems: MembershipHistoryItem[] = payments.map((p) => ({
      type: 'mercadopago' as const,
      createdAt: p.createdAt,
      amount: Number(p.amount),
      status: p.status,
      planType: p.planType,
      transactionReference: p.mercadopagoPaymentId,
    }));

    const manualItems: MembershipHistoryItem[] = proofs.map((p) => ({
      type: 'manual' as const,
      createdAt: p.createdAt,
      amount: Number(p.amount),
      status: p.status,
      membershipType: p.membershipType,
      transactionReference: p.transactionReference,
    }));

    const merged = [...mercadopagoItems, ...manualItems].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const total = merged.length;
    const start = (page - 1) * limit;
    const items = merged.slice(start, start + limit);

    return {
      items,
      meta: { total, page, limit },
    };
  }

  async remove(id: number): Promise<{ message: string; technician: ResponseTechnicianDto }> {
    const technician = await this.techniciansRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!technician) {
      throw new HttpException('Technician not found', HttpStatus.NOT_FOUND);
    }

    await this.techniciansRepository.remove(technician);

    return {
      message: 'Technician successfully deleted',
      technician: plainToInstance(ResponseTechnicianDto, technician)
    };
  }

}
