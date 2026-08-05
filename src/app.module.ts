import { Module } from '@nestjs/common';
import { TechniciansModule } from './technicians/technicians.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodingModule } from './geocoding/geocoding.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingsModule } from './bookings/bookings.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import DbConfig from './config/db.config';
import { ServicesModule } from './services/services.module';
import { CheckoutsModule } from './checkouts/checkouts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...DbConfig.options,
        autoLoadEntities: true
      })
    }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 60 }]),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    TechniciansModule,
    GeocodingModule,
    ReviewsModule,
    BookingsModule,
    FavoritesModule,
    ServicesModule,
    CheckoutsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule { }