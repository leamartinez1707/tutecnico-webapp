import { MigrationInterface, QueryRunner } from 'typeorm';

// Lista extendida con descripción. Se guarda el name en minúsculas para normalización.
const BASE_SERVICES = [
  { nombre: 'Electricidad', descripcion: 'Instalaciones eléctricas, reparaciones, tableros y cableado' },
  { nombre: 'Plomería', descripcion: 'Instalaciones sanitarias, cañerías, grifería y reparaciones' },
  { nombre: 'Climatización', descripcion: 'Aires acondicionados, calefacción, ventilación y refrigeración' },
  { nombre: 'Construcción y Albañilería', descripcion: 'Obras, reformas, mampostería y construcción en general' },
  { nombre: 'Carpintería', descripcion: 'Muebles, puertas, ventanas y trabajos en madera' },
  { nombre: 'Pintura', descripcion: 'Pintado de interiores, exteriores, empapelado y terminaciones' },
  { nombre: 'Mecánica Automotriz', descripcion: 'Reparación y mantenimiento de automóviles, motos y vehículos' },
  { nombre: 'Herrería y Soldadura', descripcion: 'Trabajos en hierro, rejas, portones y soldadura' },
  { nombre: 'Cerrajería', descripcion: 'Cerraduras, llaves, cerrojos y sistemas de seguridad' },
  { nombre: 'Vidriería', descripcion: 'Instalación y reparación de vidrios, espejos y ventanas' },
  { nombre: 'Electrodomésticos', descripcion: 'Reparación de heladeras, lavarropas, cocinas y más' },
  { nombre: 'Informática y Computación', descripcion: 'Reparación de PC, notebooks, redes y soporte técnico' },
  { nombre: 'Electrónica', descripcion: 'Reparación de TV, audio, consolas y dispositivos electrónicos' },
  { nombre: 'Telefonía y Celulares', descripcion: 'Reparación de smartphones, tablets y accesorios' },
  { nombre: 'Jardinería y Paisajismo', descripcion: 'Mantenimiento de jardines, poda, césped y diseño' },
  { nombre: 'Limpieza y Mantenimiento', descripcion: 'Limpieza profunda, mantenimiento de espacios y desinfección' },
  { nombre: 'Techos y Impermeabilización', descripcion: 'Reparación de techos, membranas y goteras' },
  { nombre: 'Pisos y Revestimientos', descripcion: 'Colocación de pisos, cerámicos, porcelanatos y alfombras' },
  { nombre: 'Gas y Gasista', descripcion: 'Instalaciones de gas, calefones, estufas y habilitaciones' },
  { nombre: 'Seguridad y Alarmas', descripcion: 'Instalación de alarmas, cámaras y sistemas de seguridad' },
  { nombre: 'Mudanzas y Fletes', descripcion: 'Traslados de muebles, mudanzas y transporte' },
  { nombre: 'Tapicería', descripcion: 'Retapizado de muebles, sillas, sillones y colchones' },
  { nombre: 'Cortinas y Persianas', descripcion: 'Instalación y reparación de cortinas, persianas y toldos' },
  { nombre: 'Piscinas', descripcion: 'Mantenimiento, limpieza y reparación de piscinas' },
  { nombre: 'Energías Renovables', descripcion: 'Paneles solares, energía eólica y sistemas sustentables' },
  { nombre: 'Antenas y Satélites', descripcion: 'Instalación de antenas, TV cable y sistemas satelitales' },
  { nombre: 'Fumigación y Control de Plagas', descripcion: 'Control de insectos, roedores y desinfección' },
  { nombre: 'Calzado y Marroquinería', descripcion: 'Reparación de zapatos, carteras y artículos de cuero' },
  { nombre: 'Costura y Confección', descripcion: 'Arreglos de ropa, confección y bordados' },
  { nombre: 'Maquinaria Industrial', descripcion: 'Mantenimiento y reparación de equipos industriales' },
  { nombre: 'Instrumentos Musicales', descripcion: 'Reparación de guitarras, pianos y equipos de audio' },
  { nombre: 'Bicicletas y Rodados', descripcion: 'Reparación y mantenimiento de bicicletas' },
  { nombre: 'Decoración y Diseño', descripcion: 'Asesoramiento en decoración, diseño de interiores' },
  { nombre: 'Fotografía y Video', descripcion: 'Reparación de cámaras y equipos audiovisuales' },
  { nombre: 'Refrigeración Comercial', descripcion: 'Cámaras frigoríficas, heladeras comerciales y exhibidoras' },
  { nombre: 'Sistemas de Riego', descripcion: 'Instalación y mantenimiento de sistemas de riego automático' },
  { nombre: 'Parquet y Madera', descripcion: 'Colocación, pulido y restauración de pisos de madera' },
  { nombre: 'Aislamiento Térmico', descripcion: 'Aislamiento de paredes, techos y ventanas' },
  { nombre: 'Electrificación Rural', descripcion: 'Instalaciones eléctricas en zonas rurales y quintas' },
  { nombre: 'Otros Servicios', descripcion: 'Otros servicios técnicos especializados' }
];

export class SeedServices1750200002000 implements MigrationInterface {
  name = 'SeedServices1750200002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // asegurar columna description si no existe
    const cols = await queryRunner.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'service'`);
    const hasDesc = cols.some((c: any) => c.column_name === 'description');
    if (!hasDesc) {
      await queryRunner.query('ALTER TABLE service ADD COLUMN "description" varchar(512) NULL');
    }
    for (const s of BASE_SERVICES) {
      const nameNorm = s.nombre.trim().toLowerCase();
      const existing = await queryRunner.query('SELECT id FROM service WHERE name = $1', [nameNorm]);
      if (!existing.length) {
        await queryRunner.query('INSERT INTO service(name, description) VALUES ($1, $2)', [nameNorm, s.descripcion]);
      } else {
        await queryRunner.query('UPDATE service SET description = $2 WHERE name = $1', [nameNorm, s.descripcion]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const s of BASE_SERVICES) {
      const nameNorm = s.nombre.trim().toLowerCase();
      await queryRunner.query('DELETE FROM service WHERE name = $1', [nameNorm]);
    }
  }
}
