import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // This line is crucial. It makes the Budget entity and its repository
    // available for injection within this module (e.g., in BudgetsService).
    TypeOrmModule.forFeature([Budget]),
    
    // We import the AuthModule so that this module has access to Passport
    // strategies, which is necessary for the @UseGuards(AuthGuard()) decorator.
    AuthModule,
  ],
  // This declares the controller that belongs to this module.
  controllers: [BudgetsController],
  
  // This declares the service that belongs to this module.
  providers: [BudgetsService],
})
export class BudgetsModule {}