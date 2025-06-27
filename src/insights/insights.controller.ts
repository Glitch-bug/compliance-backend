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
