import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Param, ParseIntPipe, Logger, Delete, Patch } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { IncrementBudgetDto } from './dto/increment-budget.dto';
import { ConsolidatedIncrementDto } from './dto/consolidated-increment.dto';

@Controller('budgets')

// Keep this commented out for now
export class BudgetsController {
  // Create a logger instance for this controller
  private readonly logger = new Logger(BudgetsController.name);

  constructor(private budgetsService: BudgetsService) {
    // This log will tell us if the controller is being instantiated by NestJS
    this.logger.log('BudgetsController has been initialized.');
  }

  @Get('/:mda/:fiscalYear')
  @UseGuards(AuthGuard()) 
  getBudgetsForMda(
    @Param('mda') mda: string,
    @Param('fiscalYear', ParseIntPipe) fiscalYear: number,
  ): Promise<Budget[]> {
    this.logger.log(`Received request for budgets for MDA: ${mda}, Year: ${fiscalYear}`);
    return this.budgetsService.getBudgetsByMda(mda, fiscalYear);
  }

  @Post()
  @UseGuards(AuthGuard()) 
  upsertBudgets(
    @Body(ValidationPipe) createBudgetDtos: CreateBudgetDto[],
  ): Promise<Budget[]> {
    return this.budgetsService.upsertBudgets(createBudgetDtos);
  }

  @Delete('/mda/:mda/:fiscalYear')
  @UseGuards(AuthGuard()) 
  deleteBudgetsForMda(
    @Param('mda') mda: string,
    @Param('fiscalYear', ParseIntPipe) fiscalYear: number,
  ): Promise<void> {
    return this.budgetsService.deleteBudgetsByMda(mda, fiscalYear);
  }

  @Patch('/increment')
  @UseGuards(ApiKeyGuard)
  incrementBudget(
    @Body(ValidationPipe) incrementBudgetDto: IncrementBudgetDto,
  ): Promise<{status:string; message: string; data:Budget}>  {
    return this.budgetsService.incrementBudget(incrementBudgetDto);
  }



  @Patch('/consolidated-increment')
  @UseGuards(ApiKeyGuard)
  consolidatedIncrement(
    @Body(ValidationPipe) consolidatedIncrementDto: ConsolidatedIncrementDto,
  ): Promise<{ status: string; message: string; data: Budget }> {
    return this.budgetsService.consolidatedIncrementFunc(consolidatedIncrementDto);
  }

}
