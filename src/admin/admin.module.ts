// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { FundingSource } from './entities/funding-source.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { RiskFactor } from './entities/risk-factor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundingSource, BudgetLine, RiskFactor]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
