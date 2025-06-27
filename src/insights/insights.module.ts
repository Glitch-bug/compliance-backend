// src/insights/insights.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { Request as RequestEntity } from '../requests/request.entity';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEntity]),
    AuthModule,
    HttpModule, // Import HttpModule to make external API calls
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
