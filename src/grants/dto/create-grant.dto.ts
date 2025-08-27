// src/grants/dto/create-grant.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGrantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  donor: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  budgetLineId: string;
}
