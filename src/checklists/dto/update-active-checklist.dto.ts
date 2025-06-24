// src/checklists/dto/update-active-checklist.dto.ts
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItemDto {
    text: string;
    completed: boolean;
}

export class UpdateActiveChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}
