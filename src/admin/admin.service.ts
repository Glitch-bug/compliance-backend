// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundingSource } from './entities/funding-source.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { RiskFactor } from './entities/risk-factor.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(FundingSource) private fundingSourceRepo: Repository<FundingSource>,
    @InjectRepository(BudgetLine) private budgetLineRepo: Repository<BudgetLine>,
    @InjectRepository(RiskFactor) private riskFactorRepo: Repository<RiskFactor>,
  ) {}

  // This service can be expanded to include create, update, delete for these entities
  async getSystemConfig() {
    const fundingSources = await this.fundingSourceRepo.find();
    const budgetLines = await this.budgetLineRepo.find();
    const riskFactors = await this.riskFactorRepo.find();
    return { fundingSources, budgetLines, riskFactors };
  }
}
