// src/admin/dto/update-amount.dto.ts
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAmountDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}