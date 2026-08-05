import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const configService = new ConfigService();

const AppDataSource = new DataSource({
    type: (configService.get<string>('DATABASE_TYPE') as any) || <string>"postgres",
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    synchronize: false,
    entities: ['src/**/*.entity.{ts,js}'],
    migrations: ['src/database/migrations/*.{ts,js}'],
    migrationsRun: false,
    logging: true,
});

export default AppDataSource;
