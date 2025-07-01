"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InsightsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
const request_entity_1 = require("../requests/request.entity");
let InsightsService = InsightsService_1 = class InsightsService {
    constructor(requestsRepository, httpService, configService) {
        this.requestsRepository = requestsRepository;
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(InsightsService_1.name);
        this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    }
    async generateReport(query) {
        const apiKey = this.configService.get('AI_API_KEY');
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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.geminiApiUrl}?key=${apiKey}`, payload, { headers }));
            this.logger.log('Received response from AI service.');
            const rawText = response.data.candidates[0]?.content?.parts[0]?.text;
            if (!rawText) {
                throw new Error('Invalid response structure from AI service.');
            }
            const cleanJsonText = rawText.replace(/```json\n?|```/g, '');
            return JSON.parse(cleanJsonText);
        }
        catch (error) {
            if (error instanceof axios_2.AxiosError) {
                this.logger.error('Error calling AI service:', error.response?.data || error.message);
            }
            else {
                this.logger.error('An unexpected error occurred:', error);
            }
            throw new Error('Failed to get insights from the AI service.');
        }
    }
    buildPrompt(query, requests) {
        const dataAsString = requests.map(r => `Request(id=${r.id}, title='${r.title}', mda='${r.mda}', amount=${r.amount}, status='${r.status}', riskScore=${r.riskScore || 'N/A'})`).join('\n');
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
};
exports.InsightsService = InsightsService;
exports.InsightsService = InsightsService = InsightsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], InsightsService);
//# sourceMappingURL=insights.service.js.map