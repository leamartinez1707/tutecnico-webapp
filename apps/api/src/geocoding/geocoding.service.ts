import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface IdeUyResult {
  puntoY: number;
  puntoX: number;
  direccion: string;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly baseUrl = 'https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion';

  // Coordenadas default de Montevideo como fallback
  private readonly DEFAULT_COORDS = { lat: -34.9011, lng: -56.1645 };

  constructor(private readonly httpService: HttpService) {}

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `${this.baseUrl}?calle=${encodedAddress}`;

      const response = await firstValueFrom(
        this.httpService.get<IdeUyResult[]>(url, { timeout: 5000 })
      );

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return { lat: result.puntoY, lng: result.puntoX };
      }

      this.logger.warn(`No se encontraron coordenadas para "${address}". Usando default.`);
      return this.DEFAULT_COORDS;
    } catch (error) {
      this.logger.warn(`Geocoding falló para "${address}": ${error.message}. Usando default.`);
      return this.DEFAULT_COORDS;
    }
  }
}
