import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RiskLevel } from './risk-level.enum';

export class CreateRiskFactorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RiskLevel)
  @IsNotEmpty()
  level: RiskLevel;
}
