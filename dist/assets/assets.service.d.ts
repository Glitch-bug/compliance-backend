import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { User } from '../users/user.entity';
export declare class AssetsService {
    private assetsRepository;
    constructor(assetsRepository: Repository<Asset>);
    create(createAssetDto: CreateAssetDto, user: User): Promise<Asset>;
    findAll(user: User, mda?: string): Promise<Asset[]>;
    findOne(id: string): Promise<Asset>;
    remove(id: string): Promise<void>;
}
