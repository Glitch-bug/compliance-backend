import { User } from '../users/user.entity';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    create(createAssetDto: CreateAssetDto, user: User): Promise<import("./asset.entity").Asset>;
    findAll(user: User, mda?: string): Promise<import("./asset.entity").Asset[]>;
    findOne(id: string): Promise<import("./asset.entity").Asset>;
    remove(id: string): Promise<void>;
}
