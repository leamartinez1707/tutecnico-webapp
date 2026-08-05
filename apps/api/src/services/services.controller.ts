import { Controller, Get, Param, ParseIntPipe, NotFoundException, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './service.entity';
import { ApiTags, ApiOkResponse, ApiParam, ApiNotFoundResponse, ApiOperation, ApiExtension, ApiQuery } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ResponseServiceDto } from './dto/response-service.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedServicesResponseDto } from './dto/paginated-services-response.dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar servicios', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedServicesResponseDto })
  async list(@Query() query: PaginationQueryDto): Promise<PaginatedServicesResponseDto> {
    const { items, total, page, limit } = await this.servicesService.findAllPaginated(query);
    return {
      items: items.map(i => ({ id: i.id, name: i.name, description: i.description })),
      meta: { total, page, limit },
    };
  }
  
  @Get('with-professions')
  @ApiOperation({ summary: 'Listar servicios con profesiones', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiOkResponse({ type: PaginatedServicesResponseDto })
  async listWithProfessions(@Query() query: PaginationQueryDto): Promise<PaginatedServicesResponseDto> {
    const { items, total, page, limit } = await this.servicesService.findAllWithProfessionsPaginated(query);
    return {
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        description: i.description,
        professions: (i.professions || []).map(p => ({ id: p.id, name: p.name, description: p.description }))
      }) as any),
      meta: { total, page, limit },
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ResponseServiceDto })
  @ApiOperation({ summary: 'Obtener servicio con profesiones', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseServiceDto> {
    const service = await this.servicesService.findOneWithProfessions(id);
    if (!service) throw new NotFoundException('Service not found');
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      professions: (service.professions || []).map(p => ({ id: p.id, name: p.name, description: p.description }))
    };
  }
}
