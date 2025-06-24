// src/checklists/dto/create-active-checklist.dto.ts
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateActiveChecklistDto {
  @IsUUID()
  @IsNotEmpty()
  templateId: string;
}
