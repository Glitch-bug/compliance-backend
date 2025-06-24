import { User } from '../users/user.entity';
import { ChecklistsService } from './checklists.service';
import { CreateActiveChecklistDto } from './dto/create-active-checklist.dto';
import { UpdateActiveChecklistDto } from './dto/update-active-checklist.dto';
export declare class ChecklistsController {
    private readonly checklistsService;
    constructor(checklistsService: ChecklistsService);
    createActive(createDto: CreateActiveChecklistDto, user: User): Promise<import("./active-checklist.entity").ActiveChecklist>;
    findAllActive(user: User): Promise<import("./active-checklist.entity").ActiveChecklist[]>;
    updateActive(id: string, updateDto: UpdateActiveChecklistDto): Promise<import("./active-checklist.entity").ActiveChecklist>;
    findAllTemplates(): Promise<import("./checklist-template.entity").ChecklistTemplate[]>;
}
