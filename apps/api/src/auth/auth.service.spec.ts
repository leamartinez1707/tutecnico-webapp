import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, UserRole } from 'src/users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const mockJwtService = () => ({
      signAsync: jest.fn().mockResolvedValue('mock-token'),
      verifyAsync: jest.fn(),
    });

    const mockConfigService = () => ({
      get: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_TOKEN_SECRET') return 'access-secret';
        if (key === 'JWT_REFRESH_TOKEN_SECRET') return 'refresh-secret';
        if (key === 'JWT_ACCESS_TOKEN_EXPIRES_IN') return '10m';
        if (key === 'JWT_REFRESH_TOKEN_EXPIRES_IN') return '7d';
        return null;
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('googleSignIn', () => {
    const googleProfile = {
      googleId: 'google-id-123',
      email: 'john.doe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create a new user and return JWT tokens when email not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const createdUser = {
        id: 1,
        username: 'john.doe',
        email: 'john.doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashed-password',
        phone: '',
        address: '',
        role: UserRole.USUARIO,
        tokenVersion: 0,
        emailVerified: false,
        isActive: true,
        emailVerificationToken: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        profilePhotoUrl: null,
      } as User;

      userRepo.create.mockReturnValue(createdUser);
      userRepo.save.mockResolvedValue(createdUser);

      const result = await service.googleSignIn(googleProfile);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@gmail.com' } });
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();

      expect(result.access_token).toBe('mock-token');
      expect(result.refresh_token).toBe('mock-token');
      expect(result.user).toBeDefined();
      
      const savedUser = userRepo.create.mock.calls[0][0];
      expect(savedUser.username).toBe('john.doe');
      expect(savedUser.email).toBe('john.doe@gmail.com');
      expect(savedUser.firstName).toBe('John');
      expect(savedUser.lastName).toBe('Doe');
      expect(savedUser.role).toBe(UserRole.USUARIO);
    });

    it('should return JWT tokens for existing user without duplicate creation', async () => {
      const existingUser = {
        id: 2,
        username: 'existing.user',
        email: 'john.doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashed-password',
        phone: '555-1234',
        address: '123 Main St',
        role: UserRole.TECNICO,
        tokenVersion: 0,
        emailVerified: true,
        isActive: true,
        emailVerificationToken: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        profilePhotoUrl: null,
      } as User;

      userRepo.findOne.mockResolvedValue(existingUser);

      const result = await service.googleSignIn(googleProfile);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@gmail.com' } });
      expect(userRepo.create).not.toHaveBeenCalled();
      expect(result.access_token).toBe('mock-token');
      expect(result.refresh_token).toBe('mock-token');
      expect(result.user).toBeDefined();
    });
  });
});
