import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    // Wrap AuthModule in forwardRef to break the circular dependency
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