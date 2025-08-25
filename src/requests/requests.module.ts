import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request as RequestEntity } from './request.entity';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { AuthModule } from '../auth/auth.module';
import { ActiveChecklist } from 'src/checklists/entity/active-checklist.entity';
import { ChecklistTemplate } from 'src/checklists/entity/checklist-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, ActiveChecklist, ChecklistTemplate]), AuthModule,],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
