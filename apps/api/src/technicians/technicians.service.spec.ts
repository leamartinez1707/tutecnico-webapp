import { Test, TestingModule } from '@nestjs/testing';
import { TechniciansService, MembershipHistoryItem } from './technicians.service';
import { Technician, MembershipType } from './technician.entity';
import { User, UserRole } from 'src/users/user.entity';
import { Payment, PaymentStatus, SubscriptionPlanType } from 'src/checkouts/entities/payment.entity';
import { PaymentProof, PaymentProofStatus } from 'src/checkouts/entities/payment-proof.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { ServicesService } from 'src/services/services.service';

describe('TechniciansService — Membership', () => {
  let service: TechniciansService;
  let technicianRepo: jest.Mocked<Repository<Technician>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let paymentRepo: jest.Mocked<Repository<Payment>>;
  let paymentProofRepo: jest.Mocked<Repository<PaymentProof>>;

  const mockTechnician = {
    id: 1,
    membershipType: MembershipType.TRIAL,
    membershipActive: true,
    membershipStartedAt: new Date('2026-01-01'),
    membershipExpiresAt: new Date('2026-02-01'),
    createdAt: new Date('2026-01-01'),
    user: { id: 5 } as User,
    specialization: 'Plumbing',
    latitude: 0,
    longitude: 0,
    averageRating: 4.5,
    reviewsCount: 10,
    services: [],
    reviews: [],
    bookings: [],
    favoritedBy: [],
  } as Technician;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      findOneBy: jest.fn(),
      findOneOrFail: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechniciansService,
        { provide: getRepositoryToken(Technician), useFactory: mockRepo },
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: getRepositoryToken(Payment), useFactory: mockRepo },
        { provide: getRepositoryToken(PaymentProof), useFactory: mockRepo },
        {
          provide: GeocodingService,
          useValue: { getCoordinates: jest.fn().mockResolvedValue({ lat: 0, lng: 0 }) },
        },
        {
          provide: ServicesService,
          useValue: { findOrCreateByNames: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = module.get<TechniciansService>(TechniciansService);
    technicianRepo = module.get(getRepositoryToken(Technician));
    userRepo = module.get(getRepositoryToken(User));
    paymentRepo = module.get(getRepositoryToken(Payment));
    paymentProofRepo = module.get(getRepositoryToken(PaymentProof));
  });

  describe('findMembershipStatus', () => {
    it('should return membership fields when technician exists', async () => {
      technicianRepo.findOne.mockResolvedValue(mockTechnician);

      const result = await service.findMembershipStatus(1);

      expect(result).toEqual({
        membershipType: 'TRIAL',
        membershipActive: true,
        membershipStartedAt: mockTechnician.membershipStartedAt,
        membershipExpiresAt: mockTechnician.membershipExpiresAt,
      });
    });

    it('should throw NotFoundException when technician does not exist', async () => {
      technicianRepo.findOne.mockResolvedValue(null);

      await expect(service.findMembershipStatus(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitPaymentProof', () => {
    const validDto = {
      membershipType: 'PAID',
      transactionReference: 'TXN-12345',
      transactionDate: '2026-08-04T10:00:00.000Z',
      amount: 990,
      bankAccount: '1234567890',
    };

    it('should create and save a PaymentProof with PENDING status', async () => {
      const savedProof = {
        id: 1,
        membershipType: 'PAID',
        transactionReference: 'TXN-12345',
        transactionDate: new Date('2026-08-04T10:00:00.000Z'),
        amount: 990,
        bankAccount: '1234567890',
        status: PaymentProofStatus.PENDING,
        technician: mockTechnician,
        createdAt: new Date(),
      };

      technicianRepo.findOne.mockResolvedValue(mockTechnician);
      paymentProofRepo.create.mockReturnValue(savedProof as PaymentProof);
      paymentProofRepo.save.mockResolvedValue(savedProof as PaymentProof);

      const result = await service.submitPaymentProof(1, validDto);

      expect(result.status).toBe(PaymentProofStatus.PENDING);
      expect(result.membershipType).toBe('PAID');
      expect(result.transactionReference).toBe('TXN-12345');
      expect(paymentProofRepo.create).toHaveBeenCalled();
      expect(paymentProofRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when technician does not exist', async () => {
      technicianRepo.findOne.mockResolvedValue(null);

      await expect(service.submitPaymentProof(999, validDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMembershipHistory', () => {
    it('should return empty items when no payments or proofs exist', async () => {
      technicianRepo.findOne.mockResolvedValue(mockTechnician);
      paymentRepo.find.mockResolvedValue([]);
      paymentProofRepo.find.mockResolvedValue([]);

      const result = await service.findMembershipHistory(1);

      expect(result.items).toEqual([]);
      expect(result.meta).toEqual({ total: 0, page: 1, limit: 20 });
    });

    it('should merge payments and proofs sorted by createdAt DESC', async () => {
      const payment = {
        id: 1,
        mercadopagoPaymentId: 'mp-123',
        status: PaymentStatus.APPROVED,
        amount: 990,
        planType: SubscriptionPlanType.MONTHLY,
        createdAt: new Date('2026-08-01'),
        technician: mockTechnician,
      } as Payment;

      const proof = {
        id: 2,
        membershipType: 'TRIAL',
        transactionReference: 'TXN-456',
        transactionDate: new Date('2026-08-03'),
        amount: 0,
        bankAccount: '12345',
        status: PaymentProofStatus.PENDING,
        createdAt: new Date('2026-08-03'),
        technician: mockTechnician,
      } as PaymentProof;

      technicianRepo.findOne.mockResolvedValue(mockTechnician);
      paymentRepo.find.mockResolvedValue([payment]);
      paymentProofRepo.find.mockResolvedValue([proof]);

      const result = await service.findMembershipHistory(1);

      expect(result.items).toHaveLength(2);
      expect(result.meta.total).toBe(2);

      // Proof should be first (more recent createdAt)
      expect(result.items[0].type).toBe('manual');
      expect(result.items[0].membershipType).toBe('TRIAL');

      // Payment should be second
      expect(result.items[1].type).toBe('mercadopago');
      expect(result.items[1].planType).toBe('monthly');
    });

    it('should respect pagination', async () => {
      const proofs = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        membershipType: 'PAID',
        transactionReference: `TXN-${i}`,
        transactionDate: new Date(),
        amount: 990,
        bankAccount: '12345',
        status: PaymentProofStatus.PENDING,
        createdAt: new Date(`2026-08-0${5 - i}`),
        technician: mockTechnician,
      } as PaymentProof));

      technicianRepo.findOne.mockResolvedValue(mockTechnician);
      paymentRepo.find.mockResolvedValue([]);
      paymentProofRepo.find.mockResolvedValue(proofs);

      const result = await service.findMembershipHistory(1, 1, 2);

      expect(result.items).toHaveLength(2);
      expect(result.meta).toEqual({ total: 5, page: 1, limit: 2 });
    });

    it('should throw NotFoundException when technician does not exist', async () => {
      technicianRepo.findOne.mockResolvedValue(null);

      await expect(service.findMembershipHistory(999)).rejects.toThrow(NotFoundException);
    });
  });
});
