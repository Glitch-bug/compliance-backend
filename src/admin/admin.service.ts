// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundingSource } from './entities/funding-source.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { RiskFactor } from './entities/risk-factor.entity';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';
import { CreateRiskFactorDto } from './dto/create-risk-factor.dto';
import { CreateFundingSourceDto } from './dto/create-funding-source.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(FundingSource) private fundingSourceRepo: Repository<FundingSource>,
    @InjectRepository(BudgetLine) private budgetLineRepo: Repository<BudgetLine>,
    @InjectRepository(RiskFactor) private riskFactorRepo: Repository<RiskFactor>,
  ) { }

  // This service can be expanded to include create, update, delete for these entities
  async getSystemConfig() {
    const fundingSources = await this.fundingSourceRepo.find();
    const budgetLines = await this.budgetLineRepo.find();
    const riskFactors = await this.riskFactorRepo.find();
    return { fundingSources, budgetLines, riskFactors };
  }


  async getBudgetLine(mda: string) {
    console.log(`The Mda ${mda}`)
    console.log(`Is all mda match ${(mda !== 'All MDAs')}`)
    if (mda && (mda !== 'All MDAs')) {
      return this.budgetLineRepo.find({ where: { mda: mda } });
    } else {
      return this.budgetLineRepo.find();
    }
  }

  async createBudgetLine(createBudgetLineDto: CreateBudgetLineDto): Promise<{ status: string; message: string; data: BudgetLine }> {
    const newBudgetLine = this.budgetLineRepo.create(createBudgetLineDto);
    this.budgetLineRepo.save(newBudgetLine);
    return {
        status: "success",
        message: `Successfully created new budget line "${newBudgetLine.name}".`,
        data: newBudgetLine
    };
  }

  async createRiskFactor(createRiskFactorDto: CreateRiskFactorDto): Promise<RiskFactor> {
    const newRiskFactor = this.budgetLineRepo.create(createRiskFactorDto);
    return this.riskFactorRepo.save(newRiskFactor);
  }

  async createFundingSource(createFundingSourceDto: CreateFundingSourceDto): Promise<FundingSource> {
    const newFundingSource = this.fundingSourceRepo.create(createFundingSourceDto);
    return this.fundingSourceRepo.save(newFundingSource);
  }

  async incrementBudgetLineAmount(id: string, amountToAdd: number): Promise<{ status: string; message: string; data: BudgetLine }> {
    const budgetLine = await this.budgetLineRepo.findOneBy({ id });
    if (!budgetLine) {
      throw new NotFoundException(`BudgetLine with ID "${id}" not found`);
    }
    // TypeORM automatically handles converting string from DB to number
    budgetLine.amount = Number(budgetLine.amount) + amountToAdd;
    const updatedBudgetLine = await this.budgetLineRepo.save(budgetLine);
    return {
        status: "success",
        message: `Successfully incremented budget line "${updatedBudgetLine.name}" by ${amountToAdd}.`,
        data: updatedBudgetLine
    };
  }


  async incrementBudgetLineAmountWithCreateDto(createBudgetLineDto: CreateBudgetLineDto): Promise<{ status: string; message: string; data: BudgetLine }>  {
    const budgetLine = await this.budgetLineRepo.findOneBy({id: createBudgetLineDto.id });

    if (!budgetLine) {
      throw new NotFoundException(`BudgetLine with ID "${createBudgetLineDto.id}" not found`);
    }
    // TypeORM automatically handles converting string from DB to number
    budgetLine.amount = Number(budgetLine.amount) +  createBudgetLineDto.amount;
        const updatedBudgetLine = await this.budgetLineRepo.save(budgetLine);
    return {
        status: "success",
        message: `Successfully incremented budget line "${updatedBudgetLine.name}" by ${createBudgetLineDto.amount}.`,
        data: updatedBudgetLine
    };
  }


    // --- New Delete Methods ---

  async deleteFundingSource(id: string): Promise<void> {
    const result = await this.fundingSourceRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`FundingSource with ID "${id}" not found`);
    }
  }

  async deleteBudgetLine(id: string): Promise<void> {
    const result = await this.budgetLineRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BudgetLine with ID "${id}" not found`);
    }
  }

  async deleteRiskFactor(id: string): Promise<void> {
    const result = await this.riskFactorRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RiskFactor with ID "${id}" not found`);
    }
  }


}
