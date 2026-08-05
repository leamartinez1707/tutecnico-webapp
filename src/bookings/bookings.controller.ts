import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ResponseBookingsDto } from './dto/response-bookings';
import { PaginatedBookingsResponseDto } from './dto/paginated-bookings-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CheckOwnership } from 'src/guards/check-ownership.decorator';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/users/user.entity';
import { Request } from 'express';
import { MembershipGuard } from 'src/guards/membership.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiOperation, ApiExtension, ApiCreatedResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Roles(UserRole.USUARIO, UserRole.TECNICO)
  @UseGuards(JwtAuthGuard, RolesGuard, MembershipGuard)
  @Post()
  @ApiOperation({ summary: 'Crear reserva', description: 'Access: Roles(USUARIO, TECNICO)' })
  @ApiExtension('x-roles', ['USUARIO', 'TECNICO'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiCreatedResponse({ type: ResponseBookingsDto })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: Request): Promise<ResponseBookingsDto> {
    const booking = await this.bookingsService.create(createBookingDto);
    return this.mapBooking(booking);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar reservas (admin)', description: 'Access: Roles(ADMIN)' })
  @ApiExtension('x-roles', ['ADMIN'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedBookingsResponseDto, schema: { example: { items: [ { id: 42, date: '2025-11-21T10:00:00.000Z', comment: 'Necesito revisión del cableado', status: 'pending', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } ], meta: { total: 1, page: 1, limit: 20 } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedBookingsResponseDto> {
    const { items, total, page, limit } = await this.bookingsService.findAll(query);
    return {
      items: items.map(b => this.mapBooking(b)),
      meta: { total, page, limit },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USUARIO, UserRole.TECNICO)
  @CheckOwnership('BookingsService', { ownerFields: ['user.id', 'technician.user.id'] })
  @Get(':id')
  @ApiOperation({ summary: 'Obtener reserva', description: 'Access: Roles(ADMIN, USUARIO, TECNICO) con ownership' })
  @ApiExtension('x-roles', ['ADMIN', 'USUARIO', 'TECNICO'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseBookingsDto, schema: { example: { id: 42, date: '2025-11-21T10:00:00.000Z', comment: 'Necesito revisión del cableado', status: 'pending', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada' })
  async findOne(@Param('id') id: number): Promise<ResponseBookingsDto> {
    const booking = await this.bookingsService.findOne(+id);
    return this.mapBooking(booking);
  }

  @Roles(UserRole.USUARIO, UserRole.TECNICO)
  @UseGuards(JwtAuthGuard, RolesGuard, MembershipGuard)
  @CheckOwnership('BookingsService', { ownerFields: ['user.id', 'technician.user.id'] })
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reserva', description: 'Access: Roles(USUARIO, TECNICO) con ownership' })
  @ApiExtension('x-roles', ['USUARIO', 'TECNICO'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseBookingsDto, schema: { example: { id: 42, date: '2025-11-21T10:00:00.000Z', comment: 'Necesito revisión del cableado', status: 'pending', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente u ownership requerido' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada' })
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @Req() req: Request): Promise<ResponseBookingsDto> {
    const updated = await this.bookingsService.update(+id, updateBookingDto);
    return this.mapBooking(updated);
  }

  @Roles(UserRole.USUARIO, UserRole.TECNICO)
  @UseGuards(JwtAuthGuard, RolesGuard, MembershipGuard)
  @CheckOwnership('BookingsService', { ownerFields: ['user.id', 'technician.user.id'] })
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reserva', description: 'Access: Roles(USUARIO, TECNICO) con ownership' })
  @ApiExtension('x-roles', ['USUARIO', 'TECNICO'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseBookingsDto, schema: { example: { id: 42, date: '2025-11-21T10:00:00.000Z', comment: 'Necesito revisión del cableado', status: 'pending', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente u ownership requerido' })
  @ApiNotFoundResponse({ description: 'Reserva no encontrada' })
  async remove(@Param('id') id: string, @Req() req: Request): Promise<ResponseBookingsDto> {
    const removed = await this.bookingsService.remove(+id);
    return this.mapBooking(removed);
  }

  private mapBooking(booking: any): ResponseBookingsDto {
    const tech = booking.technician;
    const techUser = tech?.user;
    const user = booking.user;
    return {
      id: booking.id,
      date: booking.date,
      comment: booking.comment,
      status: booking.status,
      user: {
        id: user.id,
        username: user.username,
        profilePhotoUrl: user.profilePhotoUrl || null,
      },
      technician: {
        id: tech.id,
        username: techUser?.username,
        specialization: tech.specialization,
        services: Array.isArray(tech.services) ? tech.services.map(s => s.name) : [],
        profilePhotoUrl: techUser?.profilePhotoUrl || null,
      }
    };
  }
}
