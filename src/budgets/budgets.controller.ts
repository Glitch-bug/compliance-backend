import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('budgets')
// @UseGuards(AuthGuard())        
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  /**
   * Finds all budget entries for a given MDA and fiscal year.
   */
  @Get('/:mda/:fiscalYear')
  getBudgetsForMda(
    @Param('mda') mda: string,
    @Param('fiscalYear', ParseIntPipe) fiscalYear: number,
  ): Promise<Budget[]> {
    return this.budgetsService.getBudgetsByMda(mda, fiscalYear);
  }

  /**
   * Creates or updates a batch of budget entries.
   * This now performs an "upsert" operation.
   */
  @Post()
  upsertBudgets(
    @Body(ValidationPipe) createBudgetDtos: CreateBudgetDto[],
  ): Promise<Budget[]> {
    return this.budgetsService.upsertBudgets(createBudgetDtos);
  }
}
