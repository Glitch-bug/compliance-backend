import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { BudgetsRepository } from './budgets.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), AuthModule],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetsRepository],
})
export class BudgetsModule {}
