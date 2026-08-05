import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestEmailVerificationDto } from './dto/request-email-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiExtension, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @Throttle({ login: { limit: 5, ttl: 60 } })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async signIn(@Body() loginDto: LoginDto) {
    const login = await this.authService.signIn(loginDto);
    return plainToInstance(ResponseLoginDto, login)
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @Throttle({ refresh: { limit: 10, ttl: 60 } })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const refresh = await this.authService.refreshToken(refreshTokenDto);
    return plainToInstance(ResponseLoginDto, refresh);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout en todos los dispositivos', description: 'Access: Roles(Autenticado)' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async logoutAll(@Req() req: any) {
    await this.authService.logoutAll(req.user.sub);
    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-password-reset')
  @ApiOperation({ summary: 'Solicitar reset de contraseña', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @Throttle({ requestPasswordReset: { limit: 3, ttl: 300 } })
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Resetear contraseña', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @Throttle({ resetPassword: { limit: 5, ttl: 300 } })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-email-verification')
  @ApiOperation({ summary: 'Solicitar verificación de email', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @Throttle({ requestEmailVerification: { limit: 3, ttl: 300 } })
  async requestEmailVerification(@Body() dto: RequestEmailVerificationDto) {
    return this.authService.requestEmailVerification(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  @ApiOperation({ summary: 'Verificar email', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @Throttle({ verifyEmail: { limit: 5, ttl: 300 } })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }
}
