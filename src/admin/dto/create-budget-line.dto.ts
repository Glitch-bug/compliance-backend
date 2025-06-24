import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateBudgetLineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
