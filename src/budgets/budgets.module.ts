import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { AuthModule } from '../auth/auth.module';
import { FundingSource } from 'src/admin/entities/funding-source.entity';
import { BudgetLine } from 'src/admin/entities/budget-line.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    // Wrap AuthModule in forwardRef to break the circular dependency
    TypeOrmModule.forFeature([Budget, FundingSource, BudgetLine]),
    forwardRef(() => AuthModule),
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {
  constructor() {
    console.log('🚀 BudgetsModule initialized');
  }
}