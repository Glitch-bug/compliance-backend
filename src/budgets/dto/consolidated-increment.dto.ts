import { IsString, IsNotEmpty, IsNumber, IsInt, Min, IsPositive } from 'class-validator';

/**
 * DTO for the consolidated budget increment operation.
 * Uses names for funding source and budget line for find-or-create logic.
 */
export class ConsolidatedIncrementDto {
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
