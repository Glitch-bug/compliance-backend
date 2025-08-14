// src/checklists/dto/update-active-checklist.dto.ts
import { IsArray, IsString, IsBoolean, IsDate, IsOptional, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItemDto {
  @IsString()
  text: string;

  @IsBoolean()
  completed: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastUpdated?: Date;

  @IsNumber({ maxDecimalPlaces: 2 }) // up to 2 decimal places for currency
  @Min(0) // zero and above allowed
  @IsOptional()
  @Type(() => Number)
  amount?: number;
}

export class UpdateActiveChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}
