// src/admin/dto/update-amount.dto.ts
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAmountDto {
  @Type(() => Number) // Transform incoming value to number
  @IsNumber()
  @IsPositive()
  amount: number;
}