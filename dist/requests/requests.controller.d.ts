import { User } from '../users/user.entity';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, user: User): Promise<import("./request.entity").Request>;
    findAll(user: User, mda?: string): Promise<import("./request.entity").Request[]>;
    findForReview(): Promise<import("./request.entity").Request[]>;
    update(id: string, updateRequestDto: UpdateRequestDto, user: User): Promise<import("./request.entity").Request>;
}
