import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Defines the data structure for creating a new Budget Line.
 * The 'amount' is intentionally omitted as it defaults to 0 in the entity.
 */
export class CreateBudgetLineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  mda: string;
}