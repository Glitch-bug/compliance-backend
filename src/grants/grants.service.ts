// src/grants/grants.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { CreateGrantDto } from './dto/create-grant.dto';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';

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
