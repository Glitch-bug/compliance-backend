import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request as RequestEntity } from './request.entity';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { AuthModule } from '../auth/auth.module';
import { ChecklistsModule } from 'src/checklists/checklists.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity]), AuthModule, ChecklistsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
