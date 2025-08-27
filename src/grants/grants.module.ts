// src/grants/grants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grant } from './grant.entity';
import { GrantsController } from './grants.controller';
import { GrantsService } from './grants.service';
import { AuthModule } from '../auth/auth.module';
import { Budget } from 'src/budgets/budget.entity';
import { BudgetLine } from 'src/admin/entities/budget-line.entity';
import { FundingSource } from 'src/admin/entities/funding-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grant, Budget, BudgetLine, FundingSource]), AuthModule],
  controllers: [GrantsController],
  providers: [GrantsService],
})
export class GrantsModule {}
