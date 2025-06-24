// src/grants/dto/create-grant.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

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
}
