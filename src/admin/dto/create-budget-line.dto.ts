import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsPositive } from 'class-validator';

/**
 * Defines the data structure for creating or updating a Budget Line.
 * The 'amount' is intentionally omitted as it defaults to 0 in the entity.
 */
export class CreateBudgetLineDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  mda: string;

  @IsNumber()
  @IsPositive()
  amount?: number;
}