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

  async findAll(user: User, mda?: string): Promise<Asset[]> {
      const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'National') {
        return this.assetsRepository.find({ where: { mda: mda } });
      } else {
        return this.assetsRepository.find(); // Return all for 'National' or no filter
      }
    }
    
    // For non-universal roles, they only get assets for their own MDA
    return this.assetsRepository.find({ where: { mda: user.mda } });
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOneBy({ id });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async remove(id: string): Promise<void> {
    const result = await this.assetsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Asset with ${id} not found`);
    }
  }
}
