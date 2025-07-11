import { Module, Logger } from '@nestjs/common';
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

export class BudgetsModule {
  private readonly logger = new Logger(BudgetsModule.name); // Create a logger instance

  constructor() {
    this.logger.log('BudgetsModule has been initialized.'); // Add this log
  }
}