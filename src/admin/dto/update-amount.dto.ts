// src/admin/dto/update-amount.dto.ts
import { IsNumber, IsPositive } from 'class-validator';

/**
 * DTO for requests that update a numerical amount.
 * Ensures the amount is a positive number.
 */
export class UpdateAmountDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
