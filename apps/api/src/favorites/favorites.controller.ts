import { Controller, Post, Delete, Get, Param, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorite.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CheckOwnership } from 'src/guards/check-ownership.decorator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/users/user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, ApiOperation, ApiExtension, ApiCreatedResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { ResponseFavoriteDto, RemoveFavoriteResponseDto, PaginatedFavoritesDto } from './dto/response-favorite.dto';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USUARIO)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService, private readonly jwtService: JwtService) { }

  @Post(':technicianId')
  @ApiOperation({ summary: 'Agregar favorito', description: 'Access: Roles(USUARIO)' })
  @ApiExtension('x-roles', ['USUARIO'])
  @ApiCreatedResponse({ type: ResponseFavoriteDto })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  @ApiNotFoundResponse({ description: 'Usuario o Técnico no encontrado' })
  async addFavorite(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Req() request: Request,
  ): Promise<ResponseFavoriteDto> {
    const userId = (request['user'] as { sub: number }).sub;
    const favorite = await this.favoritesService.addFavorite(userId, technicianId);
    return this.mapFavorite(favorite);
  }

  @Delete(':technicianId')
  @ApiOperation({ summary: 'Eliminar favorito', description: 'Access: Roles(USUARIO)' })
  @ApiExtension('x-roles', ['USUARIO'])
  @ApiOkResponse({ type: RemoveFavoriteResponseDto })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  @ApiNotFoundResponse({ description: 'Favorito no encontrado' })
  async removeFavorite(
    @Param('technicianId', ParseIntPipe) technicianId: number,
    @Req() request: Request,
  ): Promise<{ message: string; favorite: ResponseFavoriteDto }> {
    const userId = (request['user'] as { sub: number }).sub;
    const { message, favorite } = await this.favoritesService.removeFavorite(userId, technicianId);
    return { message, favorite: this.mapFavorite(favorite) };
  }

  @Get()
  @ApiOperation({ summary: 'Listar favoritos', description: 'Access: Roles(USUARIO)' })
  @ApiExtension('x-roles', ['USUARIO'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedFavoritesDto, schema: { example: { items: [ { id: 10, technician: { id: 3, username: 'techmartin', specialization: 'Electricista', services: ['Instalaciones','Mantenimiento'], profilePhotoUrl: null } } ], meta: { total: 1, page: 1, limit: 20 } } } })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'Rol insuficiente' })
  async getFavorites(
    @Req() request: Request,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ResponseFavoriteDto>> {
    const userId = (request['user'] as { sub: number }).sub;
    const { items, total, page, limit } = await this.favoritesService.getFavorites(userId, query);
    return { items: items.map(f => this.mapFavorite(f)), meta: { total, page, limit } };
  }

  private mapFavorite(favorite: Favorite): ResponseFavoriteDto {
    const technician = favorite.technician;
    const user = technician.user; // eager
    return {
      id: favorite.id,
      technician: {
        id: technician.id,
        username: user.username,
        specialization: technician.specialization,
        services: Array.isArray(technician.services) ? technician.services.map(s => s.name) : [],
        profilePhotoUrl: user.profilePhotoUrl || null,
      }
    };
  }
}
