#!/bin/bash
# populate_insights_module_live_ai.sh - Generates the AI Insights module with a real AI service call.
# Run this script from the root of the 'backend' project directory.

echo "--- Populating AI Insights module with Live API Call ---"

# Check if we are in the backend directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "Error: This script must be run from the root of the 'backend' project directory."
    exit 1
fi

# --- Pre-requisites ---
echo ""
echo "Step 1: Installing new dependency for HTTP requests..."
npm install @nestjs/axios axios
echo ""
echo "Step 2: Add your AI provider's API key to the .env file."
echo "Add the following line to your 'backend/.env' file:"
echo "AI_API_KEY=your_ai_api_key_here"
echo ""
echo "Press Enter to continue once you have updated your .env file..."
read

# --- Module Generation ---

# 1. Create the directory structure for the new module (if it doesn't exist)
mkdir -p src/insights/dto

# 2. Create/overwrite the DTO for incoming queries
cat > src/insights/dto/generate-insight.dto.ts << 'EOF'
// src/insights/dto/generate-insight.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateInsightDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
EOF

# 3. Create/overwrite the Insights Service to call the external AI
cat > src/insights/insights.service.ts << 'EOF'
// src/insights/insights.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Request as RequestEntity } from '../requests/request.entity';

// Define a type for the expected Gemini API response structure for better type safety
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);
  private readonly geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(
    @InjectRepository(RequestEntity)
    private requestsRepository: Repository<RequestEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a report by sending data and a query to an external AI service.
   */
  async generateReport(query: string): Promise<any> {
    const apiKey = this.configService.get<string>('AI_API_KEY');
    if (!apiKey || apiKey === 'your_ai_api_key_here') {
      throw new Error('AI_API_KEY is not configured in the .env file.');
    }
    
    const requests = await this.requestsRepository.find();
    
    if (requests.length === 0) {
      return { summary: 'There is no request data available to analyze.', report: null };
    }

    const prompt = this.buildPrompt(query, requests);
    
    const payload = {
      contents: [{
        parts: [{ "text": prompt }]
      }],
    };

    const headers = { 'Content-Type': 'application/json' };
    
    this.logger.log('Sending request to AI service...');

    try {
      const response: AxiosResponse<GeminiResponse> = await firstValueFrom(
        this.httpService.post(
          `${this.geminiApiUrl}?key=${apiKey}`,
          payload,
          { headers },
        ),
      );

      this.logger.log('Received response from AI service.');
      
      const rawText = response.data.candidates[0]?.content?.parts[0]?.text;
      if (!rawText) {
          throw new Error('Invalid response structure from AI service.');
      }
      
      const cleanJsonText = rawText.replace(/```json\n?|```/g, '');
      
      return JSON.parse(cleanJsonText);

    } catch (error) {
      // Use AxiosError type guard to safely access response data
      if (error instanceof AxiosError) {
        this.logger.error('Error calling AI service:', error.response?.data || error.message);
      } else {
        this.logger.error('An unexpected error occurred:', error);
      }
      throw new Error('Failed to get insights from the AI service.');
    }
  }

  private buildPrompt(query: string, requests: RequestEntity[]): string {
    const dataAsString = requests.map(r => 
      `Request(id=${r.id}, title='${r.title}', mda='${r.mda}', amount=${r.amount}, status='${r.status}', riskScore=${r.riskScore || 'N/A'})`
    ).join('\n');

    return `
      You are an expert financial and compliance analyst for the Ghanaian Public Sector.
      Your task is to analyze a list of public sector commitment requests based on a user's query.

      Analyze the following data:
      --- DATA START ---
      ${dataAsString}
      --- DATA END ---

      Based *only* on the data provided, answer the following user query:
      --- QUERY START ---
      "${query}"
      --- QUERY END ---

      Your response MUST be a single, valid JSON object with the following structure:
      {
        "summary": "A one-sentence summary of the findings.",
        "report": {
          "headers": ["An", "array", "of", "strings", "for", "table", "headers"],
          "rows": [["an", "array", "of"], ["arrays", "for", "the", "rows"]]
        }
      }

      The "headers" and "rows" should represent a data table that directly answers the user's query.
      For the headers, use concise and descriptive names from the data (e.g., "id", "title", "mda", "amount", "status", "riskScore").
      If no relevant data is found for the query, the "report" object should be null.
    `;
  }
}
EOF

# 4. Create/overwrite the Insights Controller
cat > src/insights/insights.controller.ts << 'EOF'
// src/insights/insights.controller.ts
import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InsightsService } from './insights.service';
import { GenerateInsightDto } from './dto/generate-insight.dto';

@Controller('insights')
@UseGuards(AuthGuard())
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('/report')
  @HttpCode(200) // Ensure POST returns 200 OK on success
  generateReport(@Body() generateInsightDto: GenerateInsightDto) {
    return this.insightsService.generateReport(generateInsightDto.query);
  }
}
EOF

# 5. Create/overwrite the Insights Module to include HttpModule
cat > src/insights/insights.module.ts << 'EOF'
// src/insights/insights.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { Request as RequestEntity } from '../requests/request.entity';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestEntity]),
    AuthModule,
    HttpModule, // Import HttpModule to make external API calls
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
EOF

# 6. Ensure the main AppModule includes the InsightsModule
# This check prevents duplicate entries if the script is run more than once.
if ! grep -q "InsightsModule" "src/app.module.ts"; then
    echo "Updating src/app.module.ts to include InsightsModule..."
    sed -i "/import { AdminModule } from '.\/admin\/admin.module';/a import { InsightsModule } from '.\/insights\/insights.module';'" src/app.module.ts
    sed -i "/AdminModule,/a \ \ \ \ InsightsModule," src/app.module.ts
else
    echo "InsightsModule is already present in src/app.module.ts."
fi

echo ""
echo "--- AI Insights module updated for live API calls. ---"
echo "A new dependency '@nestjs/axios' was installed."
echo "The endpoint POST /insights/report will now call the configured AI service."
echo "Please ensure your AI_API_KEY in the .env file is valid."
echo "You can now restart your development server with 'npm run start:dev'."
