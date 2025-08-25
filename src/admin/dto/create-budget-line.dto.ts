import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsPositive, ValidateIf } from 'class-validator';

/**
 * Defines the data structure for creating or updating a Budget Line.
 * The 'amount' is intentionally omitted as it defaults to 0 in the entity.
 */
export class CreateBudgetLineDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateIf((o) => o.amount !== null && o.amount !== undefined)
  @IsNumber()
  @IsPositive()
  amount?: number;
}