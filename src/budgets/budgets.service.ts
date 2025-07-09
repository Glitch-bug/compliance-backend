import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    // Inject the standard TypeORM repository for the Budget entity
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
  ) {}

  /**
   * Creates multiple budget entries in the database.
   * @param createBudgetDtos - An array of budget data transfer objects.
   * @returns A promise that resolves to the array of created budget entities.
   */
  async createBudgets(createBudgetDtos: CreateBudgetDto[]): Promise<Budget[]> {
    // Use the .create() method from the injected repository to prepare the entities
    const budgets = this.budgetsRepository.create(createBudgetDtos);
    
    // Use the .save() method to insert the new entities into the database
    await this.budgetsRepository.save(budgets);
    
    return budgets;
  }
}
