// src/assets/assets.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) { }

  async create(createAssetDto: CreateAssetDto, user: User): Promise<Asset> {
    const asset = this.assetsRepository.create({
      ...createAssetDto,
      mda: user.mda,
    });
    return this.assetsRepository.save(asset);
  }

  // async findAll(user: User, mda?: string): Promise<Asset[]> {
  //     const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

  //   if (universalRoles.includes(user.role)) {
  //     if (mda && mda !== 'All MDAs') {
  //       return this.assetsRepository.find({ where: { mda: mda } });
  //     } else {
  //       return this.assetsRepository.find(); // Return all for 'National' or no filter
  //     }
  //   }

  //   // For non-universal roles, they only get assets for their own MDA
  //   return this.assetsRepository.find({ where: { mda: user.mda } });
  // }

  async findAll(user: User, mda?: string): Promise<Asset[]> {
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

    const qb = this.assetsRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.activeChecklist', 'activeChecklist')
      .leftJoinAndSelect('activeChecklist.request', 'request')
      .leftJoinAndSelect('request.fundingSource', 'fundingSource')
      .addSelect(['fundingSource.name']); // pull in name only

    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'All MDAs') {
        qb.where('asset.mda = :mda', { mda });
      }
      // else → no filter, return all assets
    } else {
      // Restrict to user's own MDA
      qb.where('asset.mda = :mda', { mda: user.mda });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Asset> {
    return this.assetsRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.activeChecklist', 'activeChecklist')
      .leftJoinAndSelect('activeChecklist.request', 'request')
      .leftJoinAndSelect('request.fundingSource', 'fundingSource')
      .addSelect(['fundingSource.name'])
      .where('asset.id = :id', { id })
      .getOne();
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asset with ${id} not found`);
    }
  }
}
