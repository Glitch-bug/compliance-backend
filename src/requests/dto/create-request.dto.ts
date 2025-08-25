import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsString() title: string;
  @IsNumber() amount: number;
  @IsUUID()
  @IsNotEmpty()
  fundingSourceId: string;
  @IsUUID()
  @IsNotEmpty()
  budgetLineId: string;
  @IsOptional() @IsBoolean() isJoint?: boolean;
  @IsOptional() @IsString() partnerMda?: string;
  @IsOptional() @IsNumber() mdaContribution?: number;
  @IsOptional() @IsNumber() partnerContribution?: number;
  @IsOptional() documents?: any;
}
