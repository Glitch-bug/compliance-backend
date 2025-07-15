import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
// import { AuthModule } from '../auth/auth.module'; // <-- Temporarily commented out

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    // forwardRef(() => AuthModule), // We are removing this for the test
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {
    private readonly logger = new Logger(BudgetsModule.name);
    constructor() {
        this.logger.log('BudgetsModule has been initialized.');
    }
}
