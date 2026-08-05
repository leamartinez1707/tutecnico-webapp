import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService, ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

@Injectable()
export class GeocodingService {
    private client: Client;
    private configService: ConfigService;

    constructor() {
        this.client = new Client({});
        this.configService = new ConfigService();
    }

    async getCoordinates(address: string): Promise<{ lat: number, lng: number }> {
        const response = await this.client.geocode({
            params: {
                address: address,
                key: this.configService.get<string>('GOOGLE_API_KEY') || '',
            },
        });

        if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error('No se encontraron coordenadas para la dirección proporcionada.');
        }
    }
}