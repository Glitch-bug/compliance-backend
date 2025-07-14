import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
  ) {}

  /**
   * Retrieves all budget entries for a specific MDA and fiscal year.
   * @param mda - The name of the MDA.
   * @param fiscalYear - The fiscal year.
   */
  async getBudgetsByMda(mda: string, fiscalYear: number): Promise<Budget[]> {
    return this.budgetsRepository.find({ where: { mda, fiscalYear } });
  }

  /**
   * Creates new budget entries or updates existing ones based on the composite key
   * (mda, fundingSource, budgetLine, fiscalYear).
   * @param createBudgetDtos - An array of budget data.
   */
  async upsertBudgets(createBudgetDtos: CreateBudgetDto[]): Promise<Budget[]> {
    const budgetsToSave: Budget[] = [];

    for (const dto of createBudgetDtos) {
      // Check if a budget entry already exists
      let budget = await this.budgetsRepository.findOne({
        where: {
          mda: dto.mda,
          fundingSource: dto.fundingSource,
          budgetLine: dto.budgetLine,
          fiscalYear: dto.fiscalYear,
        },
      });

      if (budget) {
        // If it exists, update the amount
        budget.amount = dto.amount;
        budgetsToSave.push(budget);
      } else {
        // If it doesn't exist, create a new entity instance
        budget = this.budgetsRepository.create(dto);
        budgetsToSave.push(budget);
      }
    }

    // Use .save() which can handle both inserts and updates
    return this.budgetsRepository.save(budgetsToSave);
  }

    async deleteBudgetsByMda(mda: string, fiscalYear: number): Promise<void> {
    // This command finds all records matching the criteria and deletes them.
    await this.budgetsRepository.delete({ mda, fiscalYear });
  }

}
