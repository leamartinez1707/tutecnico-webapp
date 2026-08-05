import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiQuery, ApiOkResponse, ApiOperation, ApiExtension } from '@nestjs/swagger';
import { GeocodingService } from './geocoding.service';
import { plainToInstance } from 'class-transformer';
import { ResponseGeocodingDTO } from './dto/response-geocoding.dto';

@ApiTags('Geocoding')
@Controller('geocoding')
export class GeocodingController {
    constructor(private readonly geocodingService: GeocodingService) { }

    @Get('coordinates')
    @Throttle({ geocoding: { limit: 30, ttl: 60 } })
    @ApiOperation({ summary: 'Geocodificar dirección', description: 'Access: Public (rate-limited)' })
    @ApiExtension('x-roles', ['Public'])
    @ApiQuery({ name: 'address', required: true, type: String })
    @ApiOkResponse({ type: ResponseGeocodingDTO })
    async getCoordinates(@Query('address') address: string) {
        const coordinates = this.geocodingService.getCoordinates(address)
        return plainToInstance(ResponseGeocodingDTO, coordinates)
    }
}