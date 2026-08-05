import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ResponseReviewDto } from './dto/response-review.dto';
import { PaginatedReviewsResponseDto } from './dto/paginated-reviews-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CheckOwnership } from 'src/guards/check-ownership.decorator';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/users/user.entity';
import { Request } from 'express';
import { MembershipGuard } from 'src/guards/membership.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ReviewsFilterDto } from './dto/reviews-filter.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiOperation, ApiExtension, ApiCreatedResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Roles(UserRole.USUARIO)
  @UseGuards(JwtAuthGuard, RolesGuard, MembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear reseña', description: 'Access: Roles(USUARIO)' })
  @ApiExtension('x-roles', ['USUARIO'])
  @Post()
  @ApiCreatedResponse({ type: ResponseReviewDto })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: Request): Promise<ResponseReviewDto> {
    const review = await this.reviewsService.create(createReviewDto);
    return this.mapReview(review);
  }

  @Get()
  @ApiOperation({ summary: 'Listar reseñas', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedReviewsResponseDto, schema: { example: { items: [ { id: 55, rating: 5, comment: 'Excelente servicio', date: '2025-11-20T12:00:00.000Z', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } ], meta: { total: 1, page: 1, limit: 20 } } } })
  async findAll(@Query() query: PaginationQueryDto, @Query() filters: ReviewsFilterDto): Promise<PaginatedReviewsResponseDto> {
    const { items, total, page, limit } = await this.reviewsService.findAll(query, filters);
    return {
      items: items.map(r => this.mapReview(r)),
      meta: { total, page, limit }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reseña', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseReviewDto, schema: { example: { id: 55, rating: 5, comment: 'Excelente servicio', date: '2025-11-20T12:00:00.000Z', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } } })
  @ApiNotFoundResponse({ description: 'Reseña no encontrada' })
  async findOne(@Param('id') id: number): Promise<ResponseReviewDto> {
    const review = await this.reviewsService.findOne(+id);
    return this.mapReview(review);
  }

  @Roles(UserRole.USUARIO)
  @UseGuards(JwtAuthGuard, RolesGuard, MembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar reseña', description: 'Access: Roles(USUARIO) con ownership' })
  @ApiExtension('x-roles', ['USUARIO'])
  @CheckOwnership('ReviewsService', { ownerFields: ['user.id', 'technician.user.id'] })
  @Patch(':id')
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseReviewDto, schema: { example: { id: 55, rating: 4, comment: 'Buen trabajo', date: '2025-11-21T12:00:00.000Z', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente u ownership requerido' })
  @ApiNotFoundResponse({ description: 'Reseña no encontrada' })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Req() req: Request): Promise<ResponseReviewDto> {
    const updatedReview = await this.reviewsService.update(+id, updateReviewDto);
    return this.mapReview(updatedReview);
  }

  @Roles(UserRole.USUARIO)
  @UseGuards(JwtAuthGuard, RolesGuard, MembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar reseña', description: 'Access: Roles(USUARIO) con ownership' })
  @ApiExtension('x-roles', ['USUARIO'])
  @CheckOwnership('ReviewsService', { ownerFields: ['user.id', 'technician.user.id'] })
  @Delete(':id')
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseReviewDto, schema: { example: { id: 55, rating: 5, comment: 'Excelente servicio', date: '2025-11-20T12:00:00.000Z', user: { id: 7, username: 'juanp', profilePhotoUrl: null }, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente u ownership requerido' })
  @ApiNotFoundResponse({ description: 'Reseña no encontrada' })
  async remove(@Param('id') id: string, @Req() req: Request): Promise<ResponseReviewDto> {
    const removed = await this.reviewsService.remove(+id);
    return this.mapReview(removed);
  }

  private mapReview(review: any): ResponseReviewDto {
    const tech = review.technician;
    const techUser = tech?.user;
    const user = review.user;
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
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
