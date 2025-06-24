// src/assets/dto/create-asset.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  fundingSource: string;
}
