// src/checklists/dto/update-active-checklist.dto.ts
import { IsArray, IsString, IsBoolean, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItemDto {
    @IsString()
    text: string;

    @IsBoolean()
    completed: boolean;

    @IsDate()
    @IsOptional() // This can be optional from the client, as the service will manage it
    @Type(() => Date)
    lastUpdated?: Date;
}

export class UpdateActiveChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}
