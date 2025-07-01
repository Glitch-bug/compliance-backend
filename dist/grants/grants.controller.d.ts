import { User } from '../users/user.entity';
import { GrantsService } from './grants.service';
import { CreateGrantDto } from './dto/create-grant.dto';
export declare class GrantsController {
    private readonly grantsService;
    constructor(grantsService: GrantsService);
    create(createGrantDto: CreateGrantDto, user: User): Promise<import("./grant.entity").Grant>;
    findAll(user: User): Promise<import("./grant.entity").Grant[]>;
    findOne(id: string): Promise<import("./grant.entity").Grant>;
    remove(id: string): Promise<void>;
}
