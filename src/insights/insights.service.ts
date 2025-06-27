// src/insights/insights.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Request as RequestEntity } from '../requests/request.entity';

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
    
    // 1. Fetch all requests from the database. In a larger system, you might filter this first.
    const requests = await this.requestsRepository.find();
    
    if (requests.length === 0) {
      return { summary: 'There is no request data available to analyze.', report: null };
    }

    // 2. Format the data and the prompt for the AI model.
    const prompt = this.buildPrompt(query, requests);
    
    // 3. Define the payload for the Gemini API
    const payload = {
      contents: [{
        parts: [{ "text": prompt }]
      }],
      // We can add safety settings and generation config here if needed
    };

    const headers = {
      'Content-Type': 'application/json',
    };
    
    this.logger.log('Sending request to AI service...');

    try {
      // 4. Make the external API call
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.geminiApiUrl}?key=${apiKey}`,
          payload,
          { headers },
        ),
      );

      this.logger.log('Received response from AI service.');
      
      // 5. Extract and parse the AI's response text
      const rawText = response.data.candidates[0].content.parts[0].text;
      
      // Clean the response by removing markdown backticks for JSON
      const cleanJsonText = rawText.replace(/```json\n?|```/g, '');
      
      return JSON.parse(cleanJsonText);

    } catch (error) {
      this.logger.error('Error calling AI service:', error.response?.data || error.message);
      throw new Error('Failed to get insights from the AI service.');
    }
  }

  private buildPrompt(query: string, requests: RequestEntity[]): string {
    // Convert the raw data into a simpler, string-based format for the AI
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
