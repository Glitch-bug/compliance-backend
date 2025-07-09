import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetsRepository } from './budgets.repository';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(BudgetsRepository)
    private budgetsRepository: BudgetsRepository,
  ) {}

  async createBudgets(createBudgetDtos: CreateBudgetDto[]): Promise<Budget[]> {
    return this.budgetsRepository.createBudgets(createBudgetDtos);
  }
}
