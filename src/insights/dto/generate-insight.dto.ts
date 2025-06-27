// src/insights/dto/generate-insight.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateInsightDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
