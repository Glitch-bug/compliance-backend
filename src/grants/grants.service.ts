// src/grants/grants.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { CreateGrantDto } from './dto/create-grant.dto';
import { User } from '../users/user.entity';

@Injectable()
export class GrantsService {
  constructor(
    @InjectRepository(Grant)
    private grantsRepository: Repository<Grant>,
  ) {}

  async create(createGrantDto: CreateGrantDto, user: User): Promise<Grant> {
	  console.log(`user fro backend: ${user.mda}`)
    const grant = this.grantsRepository.create({
      ...createGrantDto,
      mda: user.mda,
      status: 'Active',
    });
    return this.grantsRepository.save(grant);
  }

  async findAll(user: User): Promise<Grant[]> {
    const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
    if (universalRoles.includes(user.role)) {
      return this.grantsRepository.find();
    }
    return this.grantsRepository.find({ where: { mda: user.mda } });
  }
}
