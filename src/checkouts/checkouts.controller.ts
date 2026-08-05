import { Controller, Post, Body, Req, HttpCode, HttpStatus, Get, Param, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExtension, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CheckoutsService } from './checkouts.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { PreferenceResponseDto } from './dto/preference-response.dto';
import { WebhookPaymentDto } from './dto/webhook-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Checkouts')
@Controller('checkouts')
export class CheckoutsController {
  private readonly logger = new Logger(CheckoutsController.name);

  constructor(private readonly checkoutsService: CheckoutsService) {}

  @Post('create-preference')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear preferencia de pago para suscripción', 
    description: 'Access: Roles(TECNICO, ADMIN)' 
  })
  @ApiExtension('x-roles', ['TECNICO', 'ADMIN'])
  @ApiCreatedResponse({ 
    type: PreferenceResponseDto,
    description: 'Preferencia creada exitosamente',
    schema: {
      example: {
        id: '123456789-abcd-1234-5678-123456789abc',
        init_point: 'https://www.mercadopago.com.uy/checkout/v1/redirect?pref_id=123456789-abcd-1234-5678-123456789abc',
        sandbox_init_point: 'https://sandbox.mercadopago.com.uy/checkout/v1/redirect?pref_id=123456789-abcd-1234-5678-123456789abc',
        external_reference: 'TECH-1-monthly-1732492800000'
      }
    }
  })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: 'No autenticado' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: 'Rol insuficiente' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: 'Técnico no encontrado' })
  @ApiBadRequestResponse({ type: ErrorResponseDto, description: 'Error al crear preferencia' })
  async createPreference(@Body() dto: CreatePreferenceDto): Promise<PreferenceResponseDto> {
    return this.checkoutsService.createPreference(dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Webhook de MercadoPago', 
    description: 'Access: Public (validado por MercadoPago)' 
  })
  @ApiExtension('x-roles', ['Public'])
  @ApiOkResponse({ description: 'Webhook procesado correctamente' })
  async handleWebhook(@Body() webhookData: WebhookPaymentDto, @Req() req: Request): Promise<{ status: string }> {
    this.logger.log(`Webhook received from IP: ${req.ip}`);
    
    try {
      await this.checkoutsService.handleWebhook(webhookData);
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Error processing webhook', error);
      // Retornamos 200 para que MercadoPago no reintente
      return { status: 'error' };
    }
  }

  @Get('payments/technician/:technicianId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener pagos de un técnico', 
    description: 'Access: Roles(TECNICO, ADMIN)' 
  })
  @ApiExtension('x-roles', ['TECNICO', 'ADMIN'])
  @ApiOkResponse({ description: 'Lista de pagos del técnico' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: 'No autenticado' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: 'Rol insuficiente' })
  async getPaymentsByTechnician(@Param('technicianId') technicianId: number) {
    return this.checkoutsService.getPaymentsByTechnician(+technicianId);
  }
}
