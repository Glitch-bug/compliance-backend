import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Param, ParseIntPipe, Logger, Delete } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('budgets')
// @UseGuards(AuthGuard()) // Keep this commented out for now
export class BudgetsController {
  // Create a logger instance for this controller
  private readonly logger = new Logger(BudgetsController.name);

  constructor(private budgetsService: BudgetsService) {
    // This log will tell us if the controller is being instantiated by NestJS
    this.logger.log('BudgetsController has been initialized.');
  }

  @Get('/:mda/:fiscalYear')
  getBudgetsForMda(
    @Param('mda') mda: string,
    @Param('fiscalYear', ParseIntPipe) fiscalYear: number,
  ): Promise<Budget[]> {
    this.logger.log(`Received request for budgets for MDA: ${mda}, Year: ${fiscalYear}`);
    return this.budgetsService.getBudgetsByMda(mda, fiscalYear);
  }

  @Post()
  upsertBudgets(
    @Body(ValidationPipe) createBudgetDtos: CreateBudgetDto[],
  ): Promise<Budget[]> {
    return this.budgetsService.upsertBudgets(createBudgetDtos);
  }

  @Delete('/mda/:mda/:fiscalYear')
  deleteBudgetsForMda(
    @Param('mda') mda: string,
    @Param('fiscalYear', ParseIntPipe) fiscalYear: number,
  ): Promise<void> {
    return this.budgetsService.deleteBudgetsByMda(mda, fiscalYear);
  }
}
