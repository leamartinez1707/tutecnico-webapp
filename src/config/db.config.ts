import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as path from 'path';

ConfigModule.forRoot();

const configService = new ConfigService();

const DbConfig = new DataSource({
    type: (configService.get<string>('DATABASE_TYPE') as any) || <string>'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    synchronize: false,
    // Load all entity files so CLI can diff/generate migrations if needed
    entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
    // Correct migrations path (previous path pointed to ../migrations, real folder is ../database/migrations)
    migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
    migrationsRun: false,
    logging: true,
});

export default DbConfig;
