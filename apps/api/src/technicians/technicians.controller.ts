import { Controller, Get, Post, Body, UseGuards, Param, Req, Put, Delete, Query, ForbiddenException } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { ResponseTechnicianDto } from './dto/response-technician.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ResponseTechnicianBookingsDto } from './dto/response-technician-booking.dto';
import { ResponseTechnicianReviewsDto } from './dto/response-technician-reviews.dto';
import { CheckOwnership } from 'src/guards/check-ownership.decorator';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/users/user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiOperation, ApiExtension, ApiCreatedResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { TechnicianFilterDto } from './dto/technician-filter.dto';
import { BookingsService } from 'src/bookings/bookings.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ResponseBookingsDto } from 'src/bookings/dto/response-bookings';
import { ResponseReviewDto } from 'src/reviews/dto/response-review.dto';
import { PaginatedTechniciansResponseDto } from './dto/paginated-technicians-response.dto';
import { PaginatedBookingsResponseDto } from 'src/bookings/dto/paginated-bookings-response.dto';
import { PaginatedReviewsResponseDto } from 'src/reviews/dto/paginated-reviews-response.dto';
import { CreatePaymentProofDto } from './dto/create-payment-proof.dto';

@ApiTags('Technicians')
@Controller('technicians')
export class TechniciansController {
  constructor(
    private readonly techniciansService: TechniciansService,
    private readonly jwtService: JwtService,
    private readonly bookingsService: BookingsService,
    private readonly reviewsService: ReviewsService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Registrar técnico', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async create(@Body() createTechnicianDto: CreateTechnicianDto, @Req() request: Request): Promise<ResponseTechnicianDto> {
    // Optionally enforce that a USUARIO cannot create multiple technician profiles (service layer can validate)
    const tech = await this.techniciansService.create(createTechnicianDto)
    return plainToInstance(ResponseTechnicianDto, tech);
  }

  @Get()
  @ApiOperation({ summary: 'Listar técnicos', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedTechniciansResponseDto })
  async findAll(@Query() query: PaginationQueryDto, @Query() filters: TechnicianFilterDto): Promise<PaginatedTechniciansResponseDto> {
    const { items, total, page, limit } = await this.techniciansService.findAll(query, filters);
    return {
      items: plainToInstance(ResponseTechnicianDto, items),
      meta: { total, page, limit }
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil técnico propio', description: 'Access: Roles(TECNICO)' })
  @ApiExtension('x-roles', ['TECNICO'])
  @Get('me')
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseTechnicianDto })
  async getPersonalInfo(@Req() request: Request): Promise<ResponseTechnicianDto> {
    const currentUser = request['user'] as { username: string };
    const technician = await this.techniciansService.findByUsername(currentUser.username);
    if (!technician) {
      throw new Error('Technician not found');
    }
    return plainToInstance(ResponseTechnicianDto, technician);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Obtener técnico por username', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiOkResponse({ type: ResponseTechnicianDto })
  async findByUsername(@Param('username') username: string): Promise<ResponseTechnicianDto> {
    const tech = await this.techniciansService.findByUsername(username);
    return plainToInstance(ResponseTechnicianDto, tech);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar reservas del técnico', description: 'Access: Roles(ADMIN, TECNICO). TECNICO solo las propias.' })
  @ApiExtension('x-roles', ['ADMIN', 'TECNICO'])
  @Get(':username/bookings')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedBookingsResponseDto })
  async findBookings(
    @Param('username') username: string,
    @Req() request: Request,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedBookingsResponseDto> {
    const user = request['user'] as { username: string; sub: number; role?: string } | undefined;
    if (user && user['role'] === UserRole.TECNICO && user.username !== username) {
      throw new ForbiddenException('You can only view your own bookings');
    }
    const { items, total, page, limit } = await this.bookingsService.findByTechnicianUsername(username, query);
    return { items: plainToInstance(ResponseBookingsDto, items), meta: { total, page, limit } };
  }

  @Get(':username/reviews')
  @ApiOperation({ summary: 'Listar reseñas del técnico', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedReviewsResponseDto })
  async findReviews(@Param('username') username: string, @Query() query: PaginationQueryDto): Promise<PaginatedReviewsResponseDto> {
    const { items, total, page, limit } = await this.reviewsService.findByTechnicianUsername(username, query);
    return { items: plainToInstance(ResponseReviewDto, items), meta: { total, page, limit } };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil técnico', description: 'Access: Roles(TECNICO) con ownership' })
  @ApiExtension('x-roles', ['TECNICO'])
  @CheckOwnership('TechniciansService', { ownerFields: ['user.id'] })
  @Put(':id')
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async update(
    @Param('id') id: number,
    @Body() updateTechnicianDto: UpdateTechnicianDto
  ): Promise<ResponseTechnicianDto> {
    const tech = await this.techniciansService.update(id, updateTechnicianDto);
    return plainToInstance(ResponseTechnicianDto, tech);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar perfil técnico', description: 'Access: Roles(TECNICO) con ownership' })
  @ApiExtension('x-roles', ['TECNICO'])
  @CheckOwnership('TechniciansService', { ownerFields: ['user.id'] })
  @Delete(':id')
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async remove(@Param('id') id: number): Promise<{ message: string; technician: ResponseTechnicianDto }> {
    return await this.techniciansService.remove(id);
  }

  // Utilities for membership management (could be restricted to admins later)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estado de membresía', description: 'Access: Roles(TECNICO, ADMIN) con ownership' })
  @ApiExtension('x-roles', ['TECNICO', 'ADMIN'])
  @ApiOkResponse({ description: 'Membership status returned' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @CheckOwnership('TechniciansService', { ownerFields: ['user.id'] })
  @Get(':id/membership/status')
  async getMembershipStatus(@Param('id') id: number) {
    return this.techniciansService.findMembershipStatus(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir comprobante de pago', description: 'Access: Roles(TECNICO) con ownership' })
  @ApiExtension('x-roles', ['TECNICO'])
  @ApiCreatedResponse({ description: 'Payment proof stored' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @CheckOwnership('TechniciansService', { ownerFields: ['user.id'] })
  @Post(':id/membership/proof')
  async submitPaymentProof(
    @Param('id') id: number,
    @Body() dto: CreatePaymentProofDto,
  ) {
    return this.techniciansService.submitPaymentProof(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TECNICO, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Historial de membresía', description: 'Access: Roles(TECNICO, ADMIN) con ownership. Mergea pagos de MercadoPago y comprobantes manuales.' })
  @ApiExtension('x-roles', ['TECNICO', 'ADMIN'])
  @ApiOkResponse({ description: 'Paginated membership history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @CheckOwnership('TechniciansService', { ownerFields: ['user.id'] })
  @Get(':id/membership/history')
  async getMembershipHistory(
    @Param('id') id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.techniciansService.findMembershipHistory(id, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar membresía paga', description: 'Access: Roles(ADMIN)' })
  @ApiExtension('x-roles', ['ADMIN'])
  @Post(':id/membership/activate')
  async activatePaidMembership(
    @Param('id') id: number,
    @Query('months') months = 1,
  ): Promise<ResponseTechnicianDto> {
    const tech = await this.techniciansService.activatePaidMembership(id, Number(months) || 1);
    return plainToInstance(ResponseTechnicianDto, tech);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forzar expiración check', description: 'Access: Roles(ADMIN)' })
  @ApiExtension('x-roles', ['ADMIN'])
  @Post('membership/expire-now')
  async runExpirationNow(): Promise<{ expired: number }> {
    const expired = await this.techniciansService.runMembershipExpirationCheck();
    return { expired };
  }

}