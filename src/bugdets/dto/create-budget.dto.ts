import { IsString, IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateBudgetDto {
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
  amount: number;

  @IsInt()
  @Min(2020)
  fiscalYear: number;
}
