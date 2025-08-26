// src/assets/dto/create-asset.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDateString()
  @IsNotEmpty()
  acquiredDate: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsUUID()
  @IsNotEmpty()
  budgetLineId: string;  

  @IsString()
  @IsNotEmpty()
  mda: string;
}
