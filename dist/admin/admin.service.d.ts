import { Repository } from 'typeorm';
import { FundingSource } from './entities/funding-source.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { RiskFactor } from './entities/risk-factor.entity';
export declare class AdminService {
    private fundingSourceRepo;
    private budgetLineRepo;
    private riskFactorRepo;
    constructor(fundingSourceRepo: Repository<FundingSource>, budgetLineRepo: Repository<BudgetLine>, riskFactorRepo: Repository<RiskFactor>);
    getSystemConfig(): Promise<{
        fundingSources: FundingSource[];
        budgetLines: BudgetLine[];
        riskFactors: RiskFactor[];
    }>;
}
