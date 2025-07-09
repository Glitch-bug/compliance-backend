import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('budgets')
@UseGuards(AuthGuard())
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  createBudgets(
    @Body(ValidationPipe) createBudgetDtos: CreateBudgetDto[],
  ): Promise<Budget[]> {
    return this.budgetsService.createBudgets(createBudgetDtos);
  }
}
