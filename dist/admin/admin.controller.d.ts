import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getSystemConfig(): Promise<{
        fundingSources: import("./entities/funding-source.entity").FundingSource[];
        budgetLines: import("./entities/budget-line.entity").BudgetLine[];
        riskFactors: import("./entities/risk-factor.entity").RiskFactor[];
    }>;
}
