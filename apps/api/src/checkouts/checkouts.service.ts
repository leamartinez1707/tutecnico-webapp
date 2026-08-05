import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import { Technician, MembershipType } from 'src/technicians/technician.entity';
import { Payment, PaymentStatus, SubscriptionPlanType } from './entities/payment.entity';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { PreferenceResponseDto } from './dto/preference-response.dto';

@Injectable()
export class CheckoutsService {
  private readonly logger = new Logger(CheckoutsService.name);
  private readonly client: MercadoPagoConfig;
  private readonly preferenceClient: Preference;
  private readonly paymentClient: MPPayment;

  // Precios de suscripción
  private readonly MONTHLY_PRICE = 990; // $9.90
  private readonly YEARLY_PRICE = 9990; // $99.90

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Technician)
    private technicianRepository: Repository<Technician>,
    private configService: ConfigService,
  ) {
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      this.logger.warn('MercadoPago access token not configured');
    }
    this.client = new MercadoPagoConfig({ accessToken: accessToken || '' });
    this.preferenceClient = new Preference(this.client);
    this.paymentClient = new MPPayment(this.client);
  }

  async createPreference(dto: CreatePreferenceDto): Promise<PreferenceResponseDto> {
    // Verificar que el técnico existe
    const technician = await this.technicianRepository.findOne({
      where: { id: dto.technicianId },
      relations: ['user'],
    });

    if (!technician) {
      throw new NotFoundException(`Técnico con ID ${dto.technicianId} no encontrado`);
    }

    // Determinar precio y título según el plan
    const price = dto.planType === 'monthly' ? this.MONTHLY_PRICE : this.YEARLY_PRICE;
    const title = dto.planType === 'monthly' 
      ? 'Suscripción Mensual TechFinder' 
      : 'Suscripción Anual TechFinder';
    const description = dto.planType === 'monthly'
      ? 'Acceso premium por 30 días'
      : 'Acceso premium por 365 días (ahorra 17%)';

    // Crear referencia externa
    const externalReference = `TECH-${dto.technicianId}-${dto.planType}-${Date.now()}`;

    // URLs de retorno
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const backUrls = {
      success: dto.successUrl || `${baseUrl}/subscription/success`,
      failure: dto.failureUrl || `${baseUrl}/subscription/failure`,
      pending: dto.pendingUrl || `${baseUrl}/subscription/pending`,
    };

    // Crear preferencia en MercadoPago
    try {
      const preferenceData = {
        items: [
          {
            id: `subscription-${dto.planType}`,
            title,
            description,
            quantity: 1,
            unit_price: price,
            currency_id: 'UYU',
          },
        ],
        payer: {
          name: technician.user.firstName,
          surname: technician.user.lastName,
          email: technician.user.email,
          phone: {
            number: technician.user.phone,
          },
        },
        back_urls: backUrls,
        auto_return: 'approved' as const,
        external_reference: externalReference,
        notification_url: `${this.configService.get<string>('BACKEND_URL')}/checkouts/webhook`,
        statement_descriptor: 'TECHFINDER',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      };

      const preference = await this.preferenceClient.create({ body: preferenceData });

      // Guardar registro del pago pendiente
      const payment = this.paymentRepository.create({
        mercadopagoPreferenceId: preference.id,
        mercadopagoPaymentId: '', // Se actualizará en el webhook
        status: PaymentStatus.PENDING,
        amount: price,
        planType: dto.planType === 'monthly' ? SubscriptionPlanType.MONTHLY : SubscriptionPlanType.YEARLY,
        externalReference,
        technician,
      });

      await this.paymentRepository.save(payment);

      return {
        id: preference.id || '',
        init_point: preference.init_point || '',
        sandbox_init_point: preference.sandbox_init_point || '',
        external_reference: externalReference,
      };
    } catch (error) {
      this.logger.error('Error creating MercadoPago preference', error);
      throw new BadRequestException('Error al crear la preferencia de pago');
    }
  }

  async handleWebhook(webhookData: any): Promise<void> {
    this.logger.log(`Webhook received: ${JSON.stringify(webhookData)}`);

    // Verificar que sea una notificación de pago
    if (webhookData.type !== 'payment') {
      this.logger.log(`Ignored webhook type: ${webhookData.type}`);
      return;
    }

    const paymentId = webhookData.data?.id;
    if (!paymentId) {
      this.logger.warn('Webhook without payment ID');
      return;
    }

    const paymentIdStr = String(paymentId);

    try {
      // Obtener detalles del pago desde MercadoPago
      const mpPayment = await this.paymentClient.get({ id: paymentIdStr });

      const externalReference = mpPayment.external_reference;
      const status = mpPayment.status;

      this.logger.log(`Payment ${paymentId} status: ${status}, reference: ${externalReference}`);

      // Buscar el pago en nuestra BD por referencia externa o crear uno nuevo
      let payment = await this.paymentRepository.findOne({
        where: { externalReference: externalReference || '' },
        relations: ['technician'],
      });

      if (!payment && externalReference) {
        // Intentar extraer technicianId de la referencia
        const match = externalReference.match(/^TECH-(\d+)-/);
        if (match) {
          const technicianId = parseInt(match[1], 10);
          const technician = await this.technicianRepository.findOne({ where: { id: technicianId } });
          
          if (technician) {
            payment = this.paymentRepository.create({
              mercadopagoPaymentId: paymentIdStr,
              mercadopagoPreferenceId: mpPayment.order?.id?.toString() || '',
              status: this.mapMercadoPagoStatus(status || ''),
              amount: Number(mpPayment.transaction_amount || 0),
              planType: externalReference.includes('yearly') ? SubscriptionPlanType.YEARLY : SubscriptionPlanType.MONTHLY,
              externalReference,
              technician,
              metadata: JSON.stringify(mpPayment),
            });
          }
        }
      }

      if (!payment) {
        this.logger.warn(`Payment not found for reference: ${externalReference}`);
        return;
      }

      // Actualizar el estado del pago
      payment.mercadopagoPaymentId = paymentIdStr;
      payment.status = this.mapMercadoPagoStatus(status || '');
      payment.metadata = JSON.stringify(mpPayment);

      await this.paymentRepository.save(payment);

      // Si el pago fue aprobado, activar la membresía del técnico
      if (payment.status === PaymentStatus.APPROVED && payment.technician) {
        await this.activateMembership(payment.technician, payment.planType);
      }

      this.logger.log(`Payment ${paymentId} processed successfully`);
    } catch (error) {
      this.logger.error(`Error processing webhook for payment ${paymentId}`, error);
      throw error;
    }
  }

  private async activateMembership(technician: Technician, planType: SubscriptionPlanType): Promise<void> {
    const now = new Date();
    const expirationDate = new Date(now);
    
    // Calcular fecha de expiración según el plan
    if (planType === SubscriptionPlanType.MONTHLY) {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    technician.membershipType = MembershipType.PAID;
    technician.membershipActive = true;
    technician.membershipStartedAt = now;
    technician.membershipExpiresAt = expirationDate;

    await this.technicianRepository.save(technician);

    this.logger.log(`Membership activated for technician ${technician.id} until ${expirationDate.toISOString()}`);
  }

  private mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'pending': PaymentStatus.PENDING,
      'approved': PaymentStatus.APPROVED,
      'authorized': PaymentStatus.APPROVED,
      'in_process': PaymentStatus.IN_PROCESS,
      'in_mediation': PaymentStatus.IN_PROCESS,
      'rejected': PaymentStatus.REJECTED,
      'cancelled': PaymentStatus.CANCELLED,
      'refunded': PaymentStatus.REFUNDED,
      'charged_back': PaymentStatus.REFUNDED,
    };

    return statusMap[mpStatus] || PaymentStatus.PENDING;
  }

  async getPaymentsByTechnician(technicianId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { technician: { id: technicianId } },
      order: { createdAt: 'DESC' },
    });
  }
}
