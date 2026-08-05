export type UyCity = 'Montevideo' | 'Canelones' | 'Maldonado' | 'Salto' | 'Colonia';

export const uyStreetsByCity: Record<UyCity, string[]> = {
  Montevideo: [
    'Av. 18 de Julio',
    'Av. Italia',
    'Bvar. Artigas',
    'Av. Rivera',
    'Av. General Flores',
    'Av. Agraciada',
    'Av. 8 de Octubre',
    'Av. Millán',
    'Camino Maldonado',
    'Av. Luis Alberto de Herrera',
    'Colonia',
    'Soriano',
    'San José',
    'Paysandú',
    'Yi',
    'Mercedes',
    'Uruguay',
    'Convención',
    'Zabala',
    'Camacua',
  ],
  Canelones: [
    'Av. Giannasttasio',
    'Ruta Interbalnearia',
    'Av. Calcagno',
    'Av. Alvear',
    'Av. A La Playa',
    'Av. Del Canal',
    'Av. Central',
    'Av. Uruguay',
    'Av. Dr. Alberto Zum Felde',
  ],
  Maldonado: [
    'Av. Roosevelt',
    'Av. Francia',
    'Av. Batlle y Ordóñez',
    'Av. Pedragosa Sierra',
    'Gorlero',
    'La Salina',
    'Chiverta',
    'Bvar. Artigas',
    'Av. Córdoba',
  ],
  Salto: [
    'Av. Barbieri',
    'Av. Reyles',
    'Av. Patulé',
    'Artigas',
    'Brasil',
    'Uruguay',
    'Agraciada',
    'Juan H. Paiva',
  ],
  Colonia: [
    'Av. Artigas',
    'Av. General Flores',
    'Av. Franklin D. Roosevelt',
    'Ituzaingó',
    'Zorrilla de San Martín',
    'Florida',
    'Rivera',
  ],
};

export const cityBoundingBoxes: Record<UyCity, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
  Montevideo: { latMin: -34.95, latMax: -34.80, lngMin: -56.25, lngMax: -56.00 },
  Canelones: { latMin: -34.90, latMax: -34.80, lngMin: -55.98, lngMax: -55.80 },
  Maldonado: { latMin: -34.98, latMax: -34.89, lngMin: -54.97, lngMax: -54.85 },
  Salto: { latMin: -31.41, latMax: -31.33, lngMin: -57.01, lngMax: -56.98 },
  Colonia: { latMin: -34.49, latMax: -34.45, lngMin: -57.86, lngMax: -57.80 },
};

export function randomCity(rnd: () => number): UyCity {
  const cities: UyCity[] = ['Montevideo', 'Canelones', 'Maldonado', 'Salto', 'Colonia'];
  return cities[Math.floor(rnd() * cities.length)];
}

export function randomAddress(rnd: () => number): { address: string; city: UyCity } {
  const city = randomCity(rnd);
  const streets = uyStreetsByCity[city];
  const street = streets[Math.floor(rnd() * streets.length)];
  const number = 100 + Math.floor(rnd() * 9900);
  return { address: `${street} ${number}, ${city}, Uruguay`, city };
}

export function randomLatLngForCity(city: UyCity, rnd: () => number): { lat: number; lng: number } {
  const box = cityBoundingBoxes[city];
  const lat = box.latMin + (box.latMax - box.latMin) * rnd();
  const lng = box.lngMin + (box.lngMax - box.lngMin) * rnd();
  return { lat: Number(lat.toFixed(7)), lng: Number(lng.toFixed(7)) };
}
