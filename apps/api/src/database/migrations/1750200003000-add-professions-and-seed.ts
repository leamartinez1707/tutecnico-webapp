import { MigrationInterface, QueryRunner } from 'typeorm';

// Lista de profesiones a seedear
const PROFESSIONS = [
  { id: 1, nombre: 'Electricista Domiciliario', descripcion: 'Instalaciones eléctricas residenciales, reparación de circuitos y tableros eléctricos', categoria: 'Electricidad' },
  { id: 2, nombre: 'Electricista Industrial', descripcion: 'Instalaciones eléctricas de alta tensión, maquinaria industrial y mantenimiento', categoria: 'Electricidad' },
  { id: 3, nombre: 'Plomero', descripcion: 'Instalación y reparación de cañerías, grifería, sanitarios y sistemas de agua', categoria: 'Plomería' },
  { id: 4, nombre: 'Destapador de Cañerías', descripcion: 'Especialista en desobstrucción de desagües, cloacas y sistemas de drenaje', categoria: 'Plomería' },
  { id: 5, nombre: 'Técnico en Aire Acondicionado', descripcion: 'Instalación, mantenimiento y reparación de aires acondicionados split y centrales', categoria: 'Climatización' },
  { id: 6, nombre: 'Técnico en Refrigeración', descripcion: 'Reparación de heladeras, freezers y equipos de refrigeración comercial', categoria: 'Climatización' },
  { id: 7, nombre: 'Técnico en Calefacción', descripcion: 'Instalación y reparación de estufas, calefactores y sistemas de calefacción', categoria: 'Climatización' },
  { id: 8, nombre: 'Albañil', descripcion: 'Construcción, mampostería, revoques y trabajos de obra general', categoria: 'Construcción y Albañilería' },
  { id: 9, nombre: 'Maestro Mayor de Obras', descripcion: 'Dirección de proyectos de construcción, reformas integrales y habilitaciones', categoria: 'Construcción y Albañilería' },
  { id: 10, nombre: 'Yesero', descripcion: 'Colocación de placas de yeso, cielorrasos y divisiones de drywall', categoria: 'Construcción y Albañilería' },
  { id: 11, nombre: 'Carpintero', descripcion: 'Fabricación y reparación de muebles, puertas, ventanas y trabajos en madera', categoria: 'Carpintería' },
  { id: 12, nombre: 'Ebanista', descripcion: 'Muebles a medida, restauración de muebles antiguos y trabajos finos en madera', categoria: 'Carpintería' },
  { id: 13, nombre: 'Pintor', descripcion: 'Pintado de interiores y exteriores, terminaciones y decoración', categoria: 'Pintura' },
  { id: 14, nombre: 'Empapelador', descripcion: 'Colocación de papel pintado, vinilos decorativos y revestimientos murales', categoria: 'Pintura' },
  { id: 15, nombre: 'Mecánico de Automóviles', descripcion: 'Reparación y mantenimiento de motores, sistemas de frenos, suspensión', categoria: 'Mecánica Automotriz' },
  { id: 16, nombre: 'Mecánico de Motos', descripcion: 'Reparación y mantenimiento de motocicletas, ciclomotores y cuatriciclos', categoria: 'Mecánica Automotriz' },
  { id: 17, nombre: 'Mecánico Diesel', descripcion: 'Especialista en motores diesel, camiones y maquinaria pesada', categoria: 'Mecánica Automotriz' },
  { id: 18, nombre: 'Herrero', descripcion: 'Fabricación de rejas, portones, estructuras metálicas y trabajos en hierro', categoria: 'Herrería y Soldadura' },
  { id: 19, nombre: 'Soldador', descripcion: 'Soldadura de metales, estructuras, reparaciones de piezas metálicas', categoria: 'Herrería y Soldadura' },
  { id: 20, nombre: 'Cerrajero', descripcion: 'Apertura de cerraduras, instalación de cerrojos, duplicado de llaves', categoria: 'Cerrajería' },
  { id: 21, nombre: 'Vidriero', descripcion: 'Instalación y reparación de vidrios, espejos, mamparas y ventanas', categoria: 'Vidriería' },
  { id: 22, nombre: 'Técnico en Lavarropas', descripcion: 'Reparación de lavarropas automáticos, semiautomáticos y secarropas', categoria: 'Electrodomésticos' },
  { id: 23, nombre: 'Técnico en Heladeras', descripcion: 'Reparación de heladeras, freezers y conservadoras', categoria: 'Electrodomésticos' },
  { id: 24, nombre: 'Técnico en Cocinas y Hornos', descripcion: 'Reparación de cocinas, hornos eléctricos, microondas y anafes', categoria: 'Electrodomésticos' },
  { id: 25, nombre: 'Técnico en Computación', descripcion: 'Reparación de computadoras, notebooks, instalación de software y redes', categoria: 'Informática y Computación' },
  { id: 26, nombre: 'Técnico en Redes', descripcion: 'Instalación y configuración de redes, routers, switches y cableado estructurado', categoria: 'Informática y Computación' },
  { id: 27, nombre: 'Soporte Técnico Informático', descripcion: 'Asistencia técnica remota y presencial, configuración de equipos', categoria: 'Informática y Computación' },
  { id: 28, nombre: 'Técnico en Televisores', descripcion: 'Reparación de TV LED, LCD, Smart TV y sistemas de audio', categoria: 'Electrónica' },
  { id: 29, nombre: 'Técnico en Audio', descripcion: 'Reparación de equipos de sonido, parlantes, amplificadores y home theater', categoria: 'Electrónica' },
  { id: 30, nombre: 'Técnico en Consolas', descripcion: 'Reparación de PlayStation, Xbox, Nintendo y accesorios gaming', categoria: 'Electrónica' },
  { id: 31, nombre: 'Técnico en Celulares', descripcion: 'Reparación de smartphones, cambio de pantallas, baterías y componentes', categoria: 'Telefonía y Celulares' },
  { id: 32, nombre: 'Técnico en Tablets', descripcion: 'Reparación de tablets, iPad y dispositivos móviles', categoria: 'Telefonía y Celulares' },
  { id: 33, nombre: 'Jardinero', descripcion: 'Mantenimiento de jardines, poda, corte de césped y diseño paisajístico', categoria: 'Jardinería y Paisajismo' },
  { id: 34, nombre: 'Podador de Árboles', descripcion: 'Poda de árboles de altura, extracción de ramas y arbolado urbano', categoria: 'Jardinería y Paisajismo' },
  { id: 35, nombre: 'Paisajista', descripcion: 'Diseño de jardines, selección de plantas y espacios verdes', categoria: 'Jardinería y Paisajismo' },
  { id: 36, nombre: 'Personal de Limpieza', descripcion: 'Limpieza de hogares, oficinas y espacios comerciales', categoria: 'Limpieza y Mantenimiento' },
  { id: 37, nombre: 'Limpieza Profunda', descripcion: 'Limpieza de fin de obra, mudanzas y desinfección especializada', categoria: 'Limpieza y Mantenimiento' },
  { id: 38, nombre: 'Techista', descripcion: 'Reparación de techos, instalación de chapas, tejas y membranas', categoria: 'Techos y Impermeabilización' },
  { id: 39, nombre: 'Impermeabilizador', descripcion: 'Impermeabilización de techos, terrazas y tratamiento de goteras', categoria: 'Techos y Impermeabilización' },
  { id: 40, nombre: 'Colocador de Cerámicos', descripcion: 'Colocación de cerámicos, porcelanatos y revestimientos', categoria: 'Pisos y Revestimientos' },
  { id: 41, nombre: 'Colocador de Pisos Flotantes', descripcion: 'Instalación de pisos laminados, vinílicos y flotantes', categoria: 'Pisos y Revestimientos' },
  { id: 42, nombre: 'Pulidor de Pisos', descripcion: 'Pulido y plastificado de pisos de madera, parquet y mármol', categoria: 'Pisos y Revestimientos' },
  { id: 43, nombre: 'Gasista Matriculado', descripcion: 'Instalaciones de gas, calefones, estufas y habilitaciones', categoria: 'Gas y Gasista' },
  { id: 44, nombre: 'Técnico en Calefones', descripcion: 'Reparación e instalación de calefones a gas y eléctricos', categoria: 'Gas y Gasista' },
  { id: 45, nombre: 'Instalador de Alarmas', descripcion: 'Instalación de sistemas de alarmas residenciales y comerciales', categoria: 'Seguridad y Alarmas' },
  { id: 46, nombre: 'Instalador de Cámaras', descripcion: 'Instalación de cámaras de seguridad, CCTV y monitoreo', categoria: 'Seguridad y Alarmas' },
  { id: 47, nombre: 'Servicio de Mudanzas', descripcion: 'Traslados completos de mudanzas, embalaje y transporte', categoria: 'Mudanzas y Fletes' },
  { id: 48, nombre: 'Flete', descripcion: 'Transporte de muebles, electrodomésticos y materiales', categoria: 'Mudanzas y Fletes' },
  { id: 49, nombre: 'Tapicero', descripcion: 'Retapizado de sillones, sillas, muebles y restauración', categoria: 'Tapicería' },
  { id: 50, nombre: 'Instalador de Cortinas', descripcion: 'Instalación de cortinas roller, persianas y toldos', categoria: 'Cortinas y Persianas' },
  { id: 51, nombre: 'Técnico en Piscinas', descripcion: 'Mantenimiento, limpieza y reparación de piscinas', categoria: 'Piscinas' },
  { id: 52, nombre: 'Instalador de Paneles Solares', descripcion: 'Instalación de sistemas fotovoltaicos y energía solar', categoria: 'Energías Renovables' },
  { id: 53, nombre: 'Antenista', descripcion: 'Instalación de antenas de TV, FM y sistemas satelitales', categoria: 'Antenas y Satélites' },
  { id: 54, nombre: 'Fumigador', descripcion: 'Control de plagas, fumigación y desinfección', categoria: 'Fumigación y Control de Plagas' },
  { id: 55, nombre: 'Zapatero', descripcion: 'Reparación de calzado, cambio de suelas y arreglos', categoria: 'Calzado y Marroquinería' },
  { id: 56, nombre: 'Costurera', descripcion: 'Arreglos de ropa, confección a medida y bordados', categoria: 'Costura y Confección' },
  { id: 57, nombre: 'Mecánico de Bicicletas', descripcion: 'Reparación y mantenimiento de bicicletas de todo tipo', categoria: 'Bicicletas y Rodados' },
  { id: 58, nombre: 'Parquetista', descripcion: 'Colocación, pulido y restauración de pisos de madera', categoria: 'Parquet y Madera' },
  { id: 59, nombre: 'Técnico en Instrumentos Musicales', descripcion: 'Reparación de guitarras, bajos, pianos y equipos de audio musical', categoria: 'Instrumentos Musicales' },
  { id: 60, nombre: 'Técnico en Cámaras Fotográficas', descripcion: 'Reparación de cámaras digitales, lentes y equipos fotográficos', categoria: 'Fotografía y Video' }
];

export class addProfessionsAndSeed1750200003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // crear tabla si no existe
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS profession (id int PRIMARY KEY, name varchar(128) NOT NULL, description varchar(512), service_id int NOT NULL REFERENCES service(id) ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_profession_service_id ON profession(service_id)`);

    for (const p of PROFESSIONS) {
      const catNorm = p.categoria.trim().toLowerCase();
      let service = await queryRunner.query('SELECT id FROM service WHERE name = $1', [catNorm]);
      if (!service.length) {
        // intentar reemplazar " e " por " y "
        const alt = catNorm.replace(' e ', ' y ');
        if (alt !== catNorm) {
          service = await queryRunner.query('SELECT id FROM service WHERE name = $1', [alt]);
        }
      }
      if (!service.length) {
        // crear service si no existe
        await queryRunner.query('INSERT INTO service(name) VALUES ($1)', [catNorm]);
        service = await queryRunner.query('SELECT id FROM service WHERE name = $1', [catNorm]);
      }
      const serviceId = service[0].id;

      const existing = await queryRunner.query('SELECT id FROM profession WHERE id = $1', [p.id]);
      if (!existing.length) {
        await queryRunner.query('INSERT INTO profession(id, name, description, service_id) VALUES ($1, $2, $3, $4)', [p.id, p.nombre.trim(), p.descripcion, serviceId]);
      } else {
        await queryRunner.query('UPDATE profession SET name = $2, description = $3, service_id = $4 WHERE id = $1', [p.id, p.nombre.trim(), p.descripcion, serviceId]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const p of PROFESSIONS) {
      await queryRunner.query('DELETE FROM profession WHERE id = $1', [p.id]);
    }
    // opcional: dejar tabla si se desea reutilizar; aquí se elimina
    await queryRunner.query('DROP TABLE IF EXISTS profession');
  }
}