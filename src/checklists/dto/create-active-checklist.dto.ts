// src/checklists/dto/create-active-checklist.dto.ts
// src/checklists/dto/create-active-checklist.dto.ts
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateActiveChecklistDto {
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @IsString()
  @IsNotEmpty()
  name: string; // The new custom title for the checklist

  @IsUUID()
  @IsNotEmpty()
  requestId: string;  
}
