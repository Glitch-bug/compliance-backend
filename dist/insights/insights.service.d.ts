import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request as RequestEntity } from '../requests/request.entity';
export declare class InsightsService {
    private requestsRepository;
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly geminiApiUrl;
    constructor(requestsRepository: Repository<RequestEntity>, httpService: HttpService, configService: ConfigService);
    generateReport(query: string): Promise<any>;
    private buildPrompt;
}
