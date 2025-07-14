import { Module, forwardRef } from '@nestjs/common'; // <-- Import forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    
    // By wrapping AuthModule in forwardRef, we break the circular dependency.
    // This tells NestJS to resolve this import only after this module
    // has been initialized.
    forwardRef(() => AuthModule),
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}