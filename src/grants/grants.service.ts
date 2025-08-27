// src/grants/grants.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { CreateGrantDto } from './dto/create-grant.dto';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';
import { FundingSource } from 'src/admin/entities/funding-source.entity';
import { BudgetLine } from 'src/admin/entities/budget-line.entity';
import { Budget } from 'src/budgets/budget.entity';

@Injectable()
export class GrantsService {
  constructor(
    @InjectRepository(Grant)
    private grantsRepository: Repository<Grant>,
    @InjectRepository(FundingSource)
    private fundingSourceRepository: Repository<FundingSource>,
    @InjectRepository(BudgetLine)
    private readonly budgetLineRepository: Repository<BudgetLine>,
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
  ) { }

  async create(createGrantDto: CreateGrantDto, user: User): Promise<Grant> {
    console.log(`user fro backend: ${user.mda}`)
    const grant = this.grantsRepository.create({
      ...createGrantDto,
      mda: user.mda,
      status: 'Active',
    
    });
    await this.updateFundingSourceForGrant(grant);
    return this.grantsRepository.save(grant);
  }


  private async updateFundingSourceForGrant(grant: Grant) {
    var fundingSource = "Grants & Donations";
    let fsEntity = await this.fundingSourceRepository.findOne({ where: { name: fundingSource } });
    if (!fsEntity) {
      fsEntity = this.fundingSourceRepository.create({ name: fundingSource });
    }
    console.log(`grant amount ${grant.amount}`);
    var budgetLine = await this.budgetLineRepository.findOne({ where: { id: grant.budgetLineId,} }); 
    console.log(`budget line ${budgetLine.name}`);


    budgetLine.amount = budgetLine.amount + grant.amount;
    await this.budgetLineRepository.save(budgetLine);

    const fiscalYear = new Date(grant.createdAt).getFullYear();

    let budget = await this.budgetsRepository.findOne({where: { mda: grant.mda, fundingSource: fundingSource, budgetLine: budgetLine.name, fiscalYear: fiscalYear,}});
    console.log(`budget ${JSON.stringify(budget)}`);
    if (budget) {
      budget.amount += grant.amount;
    } else {
      budget = this.budgetsRepository.create({ mda: grant.mda, fundingSource: fundingSource, budgetLine: budgetLine.name, fiscalYear: fiscalYear, amount: grant.amount });
    }

    await this.budgetsRepository.save(budget);

    // return {
    //   status: "success",
    //   message: "Successfully performed consolidated budget increment.",
    //   data: savedBudget
    // };
  }

  async findAll(user: User, mda?: string): Promise<Grant[]> {
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];
    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'All MDAs') {
        return this.grantsRepository.find({ where: { mda: mda } });
      } else {
        return this.grantsRepository.find();
      }
    }
    return this.grantsRepository.find({ where: { mda: user.mda } });
  }

  async findOne(id: string): Promise<Grant> {
    const grant = await this.grantsRepository.findOneBy({ id });
    if (!grant) {
      throw new NotFoundException(`Grant with ID "\${id}" not found`);
    }
    return grant;
  }

  // async update(id: string, updateGrantDto: UpdateGrantDto): Promise<Grant> {
  //   const grant = await this.grantsRepository.preload({ id, ...updateGrantDto });
  //   if (!grant) {
  //     throw new NotFoundException(`Grant with ID "\${id}" not found`);
  //   }
  //   return this.grantsRepository.save(grant);
  // }

  async remove(id: string): Promise<void> {
    const result = await this.grantsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Grant with ID "\${id}" not found`);
    }
  }
}
