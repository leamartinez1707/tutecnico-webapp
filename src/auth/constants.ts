import { ConfigService, ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();
const configService = new ConfigService();

export const jwtConstants = {
    accessTokenSecret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    refreshTokenSecret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    accessTokenExpiresIn: '10m',
    refreshTokenExpiresIn: '7d',
};
