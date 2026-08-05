import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as path from 'path';

ConfigModule.forRoot();

const configService = new ConfigService();

const databaseUrl = configService.get<string>('DATABASE_URL');

const DbConfig = databaseUrl
  ? new DataSource({
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      synchronize: false,
      entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
      migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
      migrationsRun: false,
      logging: true,
    })
  : new DataSource({
      type: (configService.get<string>('DATABASE_TYPE') as any) || <string>'postgres',
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USER'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      synchronize: false,
      entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
      migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
      migrationsRun: false,
      logging: true,
    });

export default DbConfig;
