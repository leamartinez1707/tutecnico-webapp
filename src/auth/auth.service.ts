import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async signIn(login: LoginDto): Promise<ResponseLoginDto> {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.technician", "technician")
      .addSelect("user.password")
      .where("user.username = :username", { username: login.username })
      .getOne()
    if (!user || !(await bcrypt.compare(login.password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, role: user.role, tokenVersion: user.tokenVersion ?? 0 };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '10m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d',
    });
    const { password, ...userResponse } = user
    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: userResponse
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string, refresh_token: string, user: Object }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      // Traer el usuario con la relación de technician
      const user = await this.usersRepository.createQueryBuilder("user")
        .leftJoinAndSelect("user.technician", "technician")
        .where("user.id = :id", { id: payload.sub })
        .getOne();
      if (!user) {
        throw new UnauthorizedException();
      }
      if ((user.tokenVersion ?? 0) !== (payload.tokenVersion ?? 0)) {
        throw new UnauthorizedException();
      }
      const newPayload = { sub: user.id, username: user.username, role: user.role, tokenVersion: user.tokenVersion ?? 0 };
      const access_token = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '10m',
      });
      const refresh_token = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') || '7d',
      });

      const { password, ...userResponse } = user;
      // Si tiene datos de technician, incluirlos en el response
      if (user.technician) {
        return {
          access_token: access_token,
          refresh_token: refresh_token,
          user: {
            ...userResponse,
            technician: user.technician
          }
        };
      } else {
        return {
          access_token: access_token,
          refresh_token: refresh_token,
          user: userResponse
        };
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logoutAll(userId: number): Promise<{ success: boolean }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await this.usersRepository.save(user);
    return { success: true };
  }

  private generateToken(bytes = 32): string {
    return randomBytes(bytes).toString('hex');
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    // Avoid user enumeration: always return success
    if (!user) {
      return { success: true };
    }
    user.passwordResetToken = this.generateToken();
    const expiresMinutes = Number(this.configService.get<string>('PASSWORD_RESET_EXPIRES_MINUTES') || '30');
    user.passwordResetExpires = new Date(Date.now() + expiresMinutes * 60_000);
    await this.usersRepository.save(user);
    // TODO: send email with token
    return { success: true };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    const user = await this.usersRepository.findOne({ where: { passwordResetToken: token } });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1; // revoke existing tokens
    await this.usersRepository.save(user);
    return { success: true };
  }

  async requestEmailVerification(email: string): Promise<{ success: boolean }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    // Avoid user enumeration: always return success
    if (!user) return { success: true };
    if (user.emailVerified) return { success: true };
    user.emailVerificationToken = this.generateToken();
    await this.usersRepository.save(user);
    // TODO: send email verification token
    return { success: true };
  }

  async verifyEmail(token: string): Promise<{ success: boolean }> {
    const user = await this.usersRepository.findOne({ where: { emailVerificationToken: token } });
    if (!user) throw new BadRequestException('Invalid token');
    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.usersRepository.save(user);
    return { success: true };
  }
}
