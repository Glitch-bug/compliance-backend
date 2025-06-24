// src/assets/assets.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto, user: User): Promise<Asset> {
    const asset = this.assetsRepository.create({
      ...createAssetDto,
      mda: user.mda,
    });
    return this.assetsRepository.save(asset);
  }

  async findAll(user: User): Promise<Asset[]> {
    const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
    if (universalRoles.includes(user.role)) {
      return this.assetsRepository.find();
    }
    return this.assetsRepository.find({ where: { mda: user.mda } });
  }
}
