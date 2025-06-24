import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RiskLevel } from './risk-level.enum';

export class UpdateRiskFactorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RiskLevel)
  @IsOptional()
  level?: RiskLevel;
}
