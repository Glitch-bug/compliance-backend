import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { CreateGrantDto } from './dto/create-grant.dto';
import { User } from '../users/user.entity';
export declare class GrantsService {
    private grantsRepository;
    constructor(grantsRepository: Repository<Grant>);
    create(createGrantDto: CreateGrantDto, user: User): Promise<Grant>;
    findAll(user: User, mda?: string): Promise<Grant[]>;
    findOne(id: string): Promise<Grant>;
    remove(id: string): Promise<void>;
}
