"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const funding_source_entity_1 = require("./entities/funding-source.entity");
const budget_line_entity_1 = require("./entities/budget-line.entity");
const risk_factor_entity_1 = require("./entities/risk-factor.entity");
let AdminService = class AdminService {
    constructor(fundingSourceRepo, budgetLineRepo, riskFactorRepo) {
        this.fundingSourceRepo = fundingSourceRepo;
        this.budgetLineRepo = budgetLineRepo;
        this.riskFactorRepo = riskFactorRepo;
    }
    async getSystemConfig() {
        const fundingSources = await this.fundingSourceRepo.find();
        const budgetLines = await this.budgetLineRepo.find();
        const riskFactors = await this.riskFactorRepo.find();
        return { fundingSources, budgetLines, riskFactors };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(funding_source_entity_1.FundingSource)),
    __param(1, (0, typeorm_1.InjectRepository)(budget_line_entity_1.BudgetLine)),
    __param(2, (0, typeorm_1.InjectRepository)(risk_factor_entity_1.RiskFactor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map