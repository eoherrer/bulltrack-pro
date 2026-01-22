import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullsService } from './bulls.service';
import { BullsResolver } from './bulls.resolver';
import { Bull, Favorite } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Bull, Favorite])],
  providers: [BullsService, BullsResolver],
  exports: [BullsService],
})
export class BullsModule {}
