import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class UpdateBudgetLineDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;
}
