import { InsightsService } from './insights.service';
import { GenerateInsightDto } from './dto/generate-insight.dto';
export declare class InsightsController {
    private readonly insightsService;
    constructor(insightsService: InsightsService);
    generateReport(generateInsightDto: GenerateInsightDto): Promise<any>;
}
