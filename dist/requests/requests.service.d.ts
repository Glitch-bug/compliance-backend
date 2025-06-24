import { Repository } from 'typeorm';
import { Request as RequestEntity } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { User } from '../users/user.entity';
export declare class RequestsService {
    private requestsRepository;
    constructor(requestsRepository: Repository<RequestEntity>);
    create(createRequestDto: CreateRequestDto, user: User): Promise<RequestEntity>;
    findAll(user: User): Promise<RequestEntity[]>;
    findForReview(): Promise<RequestEntity[]>;
    update(id: string, updateRequestDto: UpdateRequestDto, user: User): Promise<RequestEntity>;
}
