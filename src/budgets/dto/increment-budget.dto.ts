// src/budgets/dto/increment-budget.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsInt, Min, IsPositive } from 'class-validator';

/**
 * DTO for incrementing a single budget cell.
 */
export class IncrementBudgetDto {
  @IsString()
  @IsNotEmpty()
  mda: string;

  @IsString()
  @IsNotEmpty()
  fundingSource: string;

  @IsString()
  @IsNotEmpty()
  budgetLine: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsInt()
  @Min(2020)
  fiscalYear: number;
}
