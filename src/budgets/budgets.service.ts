import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './budget.entity';
import { IncrementBudgetDto } from './dto/increment-budget.dto';
import { ConsolidatedIncrementDto } from './dto/consolidated-increment.dto';
import { FundingSource } from 'src/admin/entities/funding-source.entity';
import { BudgetLine } from 'src/admin/entities/budget-line.entity';

@Injectable()
export class BudgetsService {
  // fundingSourceRepository: any;
  // budgetLineRepository: any;
  constructor(
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
    @InjectRepository(FundingSource)
    private readonly fundingSourceRepository: Repository<FundingSource>,
    @InjectRepository(BudgetLine)
    private readonly budgetLineRepository: Repository<BudgetLine>,
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

  // async incrementBudget(incrementDto: IncrementBudgetDto): Promise<Budget> {
  //   const { mda, fundingSource, budgetLine, fiscalYear, amount } = incrementDto;

  //   let budget = await this.budgetsRepository.findOne({
  //     where: { mda, fundingSource, budgetLine, fiscalYear },
  //   });

  //   if (budget) {
  //     // If it exists, add the new amount to the existing amount.
  //     budget.amount = Number(budget.amount) + amount;
  //   } else {
  //     // If it doesn't exist, create a new record with the specified amount.
  //     budget = this.budgetsRepository.create({
  //       mda,
  //       fundingSource,
  //       budgetLine,
  //       fiscalYear,
  //       amount,
  //     });
  //   }

  //   return this.budgetsRepository.save(budget);
  // }


  async incrementBudget(incrementDto: IncrementBudgetDto): Promise<{status:string; message: string; data: Budget}> {
    const { mda, fundingSource, budgetLine, fiscalYear, amount } = incrementDto;



    let budget = await this.budgetsRepository.findOne({
      where: { mda, fundingSource, budgetLine, fiscalYear },
    });

    if (budget) {
      // If it exists, add the new amount to the existing amount.
      budget.amount = Number(budget.amount) + amount;
    } else {
      // If it doesn't exist, create a new record with the specified amount.
    budget = this.budgetsRepository.create({
        mda,
        fundingSource,
        budgetLine,
        fiscalYear,
        amount,
      });
    }

    const saved = await this.budgetsRepository.save(budget);

    return {
      status:"success",
      message: "Successfully updated budget",
      data: saved
    }
  }


  async consolidatedIncrementFunc(dto: ConsolidatedIncrementDto): Promise<{ status: string; message: string; data: Budget }> {
    const { mda, fundingSource, budgetLine, fiscalYear, amount } = dto;

        // Step 1: Find or create the Funding Source and increment its total
    let fsEntity = await this.fundingSourceRepository.findOne({ where: { name: fundingSource } });
    if (!fsEntity){
      fsEntity = this.fundingSourceRepository.create({ name: fundingSource });
    }


    // Step 2: Find or create the Budget Line and increment its total
    let blEntity = await this.budgetLineRepository.findOne({ where: { name: budgetLine, mda: mda } });
    if (blEntity) {
      blEntity.amount = Number(blEntity.amount) + amount;
    } else {
      blEntity = this.budgetLineRepository.create({ name: budgetLine, amount: amount, mda: mda });
    }
    await this.budgetLineRepository.save(blEntity);

    // Step 3: Find or create the specific Budget cell and increment its amount
    let budget = await this.budgetsRepository.findOne({
      where: { mda, fundingSource, budgetLine, fiscalYear },
    });

    if (budget) {
      budget.amount = Number(budget.amount) + amount;
    } else {
      budget = this.budgetsRepository.create({ mda, fundingSource, budgetLine, fiscalYear, amount });
    }
    
    const savedBudget = await this.budgetsRepository.save(budget);

    return {
      status: "success",
      message: "Successfully performed consolidated budget increment.",
      data: savedBudget

    };
  }

}
