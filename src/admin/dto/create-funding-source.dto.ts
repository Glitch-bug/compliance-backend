import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateFundingSourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
