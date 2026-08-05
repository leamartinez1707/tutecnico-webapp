import { Controller, Get, Post, Body, Param, Req, UseGuards, Patch, Delete, HttpCode, HttpStatus, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserBookingsDto } from './dto/response-user-bookings.dto';
import { ResponseUserReviewsDto } from './dto/response-user-reviews.dto';
import { CheckOwnership } from 'src/guards/check-ownership.decorator';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from './user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiOperation, ApiExtension } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { BookingsService } from 'src/bookings/bookings.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ResponseBookingsDto } from 'src/bookings/dto/response-bookings';
import { ResponseReviewDto } from 'src/reviews/dto/response-review.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { PaginatedBookingsResponseDto } from 'src/bookings/dto/paginated-bookings-response.dto';
import { PaginatedReviewsResponseDto } from 'src/reviews/dto/paginated-reviews-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly bookingsService: BookingsService,
    private readonly reviewsService: ReviewsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar usuario', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<{ success: boolean; message: string; user?: ResponseUserDto }> {
    await this.usersService.validateUniqueFields(createUserDto.username, createUserDto.email, createUserDto.phone);
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios (admin)', description: 'Access: Roles(ADMIN)' })
  @ApiExtension('x-roles', ['ADMIN'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedUsersResponseDto })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedUsersResponseDto> {
    const { items, total, page, limit } = await this.usersService.findAll(query);
    return {
      items: plainToInstance(ResponseUserDto, items),
      meta: { total, page, limit }
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USUARIO, UserRole.ADMIN)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil propio de usuario', description: 'Access: Roles(USUARIO, ADMIN)' })
  @ApiExtension('x-roles', ['USUARIO', 'ADMIN'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseUserDto })
  async getPersonalInfo(@Req() request: Request): Promise<ResponseUserDto> {
    const currentUser = request['user'] as { username: string };
    const user = await this.usersService.findByUsername(currentUser.username);
    if (!user) {
      throw new Error('User not found');
    }
    return plainToInstance(ResponseUserDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USUARIO)
  @Get(':username')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario por username', description: 'Access: Roles(ADMIN) o el propio USUARIO' })
  @ApiExtension('x-roles', ['ADMIN', 'USUARIO'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: ResponseUserDto })
  async findByUsername(@Param('username') username: string, @Req() request: Request): Promise<ResponseUserDto> {
    const currentUser = request['user'] as { username: string; role?: string } | undefined;
    if (currentUser?.role === UserRole.USUARIO && currentUser.username !== username) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const user = await this.usersService.findByUsername(username);
    return plainToInstance(ResponseUserDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USUARIO)
  @Get(':username/bookings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar reservas de usuario', description: 'Access: Roles(ADMIN) o el propio USUARIO' })
  @ApiExtension('x-roles', ['ADMIN', 'USUARIO'])
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
    const currentUser = request['user'] as { username: string; role?: string } | undefined;
    // Removed console.log for cleanliness
    if (currentUser?.role === UserRole.USUARIO && currentUser.username !== username) {
      throw new ForbiddenException('You can only view your own bookings');
    }
    const { items, total, page, limit } = await this.bookingsService.findByUserUsername(username, query);
    return { items: plainToInstance(ResponseBookingsDto, items), meta: { total, page, limit } };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USUARIO)
  @Get(':username/reviews')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar reseñas de usuario', description: 'Access: Roles(ADMIN) o el propio USUARIO' })
  @ApiExtension('x-roles', ['ADMIN', 'USUARIO'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedReviewsResponseDto })
  async findReviews(
    @Param('username') username: string,
    @Req() request: Request,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedReviewsResponseDto> {
    const currentUser = request['user'] as { username: string; role?: string } | undefined;
    if (currentUser?.role === UserRole.USUARIO && currentUser.username !== username) {
      throw new ForbiddenException('You can only view your own reviews');
    }
    const { items, total, page, limit } = await this.reviewsService.findByUserUsername(username, query);
    return { items: plainToInstance(ResponseReviewDto, items), meta: { total, page, limit } };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USUARIO)
  @CheckOwnership('UsersService', { ownerFields: ['id'] })
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar usuario (propio)', description: 'Access: Roles(USUARIO) con ownership' })
  @ApiExtension('x-roles', ['USUARIO'])
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseUserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return plainToInstance(ResponseUserDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Access: Roles(ADMIN)' })
  @ApiExtension('x-roles', ['ADMIN'])
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async remove(@Param('id') id: number): Promise<{ message: string; user: ResponseUserDto }> {
    return this.usersService.remove(id);
  }
}