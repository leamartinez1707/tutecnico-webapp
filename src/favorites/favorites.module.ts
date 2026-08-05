import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { User } from '../users/user.entity';
import { Technician } from '../technicians/technician.entity';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Technician]), GuardsModule],
  providers: [FavoritesService, { provide: 'FavoritesService', useClass: FavoritesService }],
  controllers: [FavoritesController],
  exports: [FavoritesService, 'FavoritesService'],
})
export class FavoritesModule { }
