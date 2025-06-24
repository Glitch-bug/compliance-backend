// src/grants/grants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grant } from './grant.entity';
import { GrantsController } from './grants.controller';
import { GrantsService } from './grants.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grant]), AuthModule],
  controllers: [GrantsController],
  providers: [GrantsService],
})
export class GrantsModule {}
