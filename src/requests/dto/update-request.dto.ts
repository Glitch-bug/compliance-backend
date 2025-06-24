import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsNumber() riskScore?: number;
  @IsOptional() @IsString() riskAnalysis?: string;
  @IsOptional() reviewComments?: any; // This will be the raw comment text
}
