import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetsRepository extends Repository<Budget> {
  async createBudgets(createBudgetDtos: CreateBudgetDto[]): Promise<Budget[]> {
    const budgets = this.create(createBudgetDtos);
    await this.save(budgets);
    return budgets;
  }
}
