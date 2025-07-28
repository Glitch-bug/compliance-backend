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


  async getBudgetLines(mda?: string) {
    if (mda && mda !== 'All MDAs') {
      return this.budgetLineRepo.find({ where: { mda: mda } });
    } else {
      return this.budgetLineRepo.find();
    }
  }

  async createBudgetLine(createBudgetLineDto: CreateBudgetLineDto): Promise<BudgetLine> {
    const newBudgetLine = this.budgetLineRepo.create(createBudgetLineDto);
    return this.budgetLineRepo.save(newBudgetLine);
  }

  async createRiskFactor(createRiskFactorDto: CreateRiskFactorDto): Promise<RiskFactor> {
    const newRiskFactor = this.budgetLineRepo.create(createRiskFactorDto);
    return this.riskFactorRepo.save(newRiskFactor);
  }

  async createFundingSource(createFundingSourceDto: CreateFundingSourceDto): Promise<FundingSource> {
    const newFundingSource = this.fundingSourceRepo.create(createFundingSourceDto);
    return this.fundingSourceRepo.save(newFundingSource);
  }

    async incrementBudgetLineAmount(id: string, amountToAdd: number): Promise<BudgetLine> {
    const budgetLine = await this.budgetLineRepo.findOneBy({ id });
    if (!budgetLine) {
      throw new NotFoundException(`BudgetLine with ID "${id}" not found`);
    }
    // TypeORM automatically handles converting string from DB to number
    budgetLine.amount = Number(budgetLine.amount) + amountToAdd;
    return this.budgetLineRepo.save(budgetLine);
  }

}
