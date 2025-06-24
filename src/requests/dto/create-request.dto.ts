import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateRequestDto {
  @IsString() title: string;
  @IsNumber() amount: number;
  @IsString() fundingSource: string;
  @IsString() budgetLine: string;
  @IsOptional() @IsBoolean() isJoint?: boolean;
  @IsOptional() @IsString() partnerMda?: string;
  @IsOptional() @IsNumber() mdaContribution?: number;
  @IsOptional() @IsNumber() partnerContribution?: number;
  @IsOptional() documents?: any;
}
