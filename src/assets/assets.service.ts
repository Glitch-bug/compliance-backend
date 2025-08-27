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

  async findAll(user: User, mda?: string): Promise<any[]> {
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

    let assets: Asset[];
    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'All MDAs') {
        assets = await this.assetsRepository.find({
          where: { mda },
          relations: ['activeChecklist', 'activeChecklist.request', 'activeChecklist.request.fundingSource'],
        });
      } else {
        assets = await this.assetsRepository.find({
          relations: ['activeChecklist', 'activeChecklist.request', 'activeChecklist.request.fundingSource'],
        });
      }
    } else {
      assets = await this.assetsRepository.find({
        where: { mda: user.mda },
        relations: ['activeChecklist', 'activeChecklist.request', 'activeChecklist.request.fundingSource'],
      });
    }

    return assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      acquiredDate: asset.acquiredDate,
      value: asset.value,
      mda: asset.mda,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      fundingSourceName: asset.activeChecklist?.request?.fundingSource?.name ?? null, // ✅ only fundingSourceName
    }));
  }

  async findOne(id: string): Promise<Asset> {
   return  this.assetsRepository.findOne({
        where: { id: id },
        relations: ['activeChecklist', 'activeChecklist.request', 'activeChecklist.request.fundingSource'],
      });
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asset with ${id} not found`);
    }
  }
}
