import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { HttpErrorFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const rawOrigins = (configService.get<string>('CORS_ORIGINS') || '*')
    .split(',')
    .map(o => o.trim())
    .filter(o => o.length);
  const allowAll = rawOrigins.includes('*');
  // In production, disallow '*'
  if (allowAll && (configService.get<string>('NODE_ENV') === 'production')) {
    console.warn('[SECURITY] CORS_ORIGINS includes * in production. Refusing to start with permissive CORS.');
    process.exit(1);
  }
  app.enableCors({
    origin: allowAll ? true : function (origin, callback) {
      if (!origin) return callback(null, false); // block non-browser if explicit list provided
      if (rawOrigins.includes(origin)) return callback(null, true);
      // Support subdomain wildcard like *.example.com
      const matched = rawOrigins.some(allowed => {
        if (allowed.startsWith('*.')) {
          const suffix = allowed.replace('*.', '');
            return origin.endsWith('.' + suffix) || origin === suffix;
        }
        return false;
      });
      if (matched) return callback(null, true);
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  });
  app.use(helmet());

  // Trust proxy if behind load balancer (optional; set TRUST_PROXY=1)
  if (configService.get<string>('TRUST_PROXY') === '1') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  // IP allowlist middleware (ALLOWED_IPS=ip1,ip2,subnetCIDR, etc.)
  const allowedIps = (configService.get<string>('ALLOWED_IPS') || '')
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length);
  if (allowedIps.length) {
    const ipRange = require('ip-range-check');
    app.use((req, res, next) => {
      // Extract client IP considering proxy
      const forwarded = (req.headers['x-forwarded-for'] || '') as string;
      const ip = (forwarded.split(',')[0] || req.socket.remoteAddress || '').trim();
      const ok = allowedIps.some(entry => ipRange(ip, entry));
      if (!ok) {
        return res.status(403).json({ statusCode: 403, message: 'IP not allowed', ip });
      }
      return next();
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Servyfix API')
    .setDescription('The Servyfix API description')
    .setVersion('1.0')
    .addTag('Servyfix')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, () => SwaggerModule.createDocument(app, config));

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}

bootstrap();
