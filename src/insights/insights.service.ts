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
      
      console.log(`Data received: ${response.data.candidates[0]?.content?.parts[0]?.text}`);

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
