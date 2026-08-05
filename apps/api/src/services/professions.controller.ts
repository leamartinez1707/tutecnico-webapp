import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiParam, ApiNotFoundResponse, ApiOperation, ApiExtension } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ProfessionsService } from './professions.service';
import { ResponseProfessionDto } from './dto/response-profession.dto';

@ApiTags('professions')
@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar profesiones', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiOkResponse({ type: ResponseProfessionDto, isArray: true })
  async list(): Promise<ResponseProfessionDto[]> {
    const items = await this.professionsService.findAll();
    return items.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      serviceId: p.service.id,
      serviceName: p.service.name
    }));
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Listar profesiones por servicio', description: 'Access: Public' })
  @ApiExtension('x-roles', ['Public'])
  @ApiParam({ name: 'serviceId', type: Number })
  @ApiOkResponse({ type: ResponseProfessionDto, isArray: true })
  async listByService(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<ResponseProfessionDto[]> {
    const items = await this.professionsService.findByService(serviceId);
    return items.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      serviceId: p.service.id,
      serviceName: p.service.name
    }));
  }
}