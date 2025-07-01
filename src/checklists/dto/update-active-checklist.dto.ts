// src/checklists/dto/update-active-checklist.dto.ts
import { IsArray, IsString, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItemDto {
    @IsString()
    text: string;
    @IsBoolean()
    completed: boolean;
}

export class UpdateActiveChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}
