import { Repository } from 'typeorm';
import { ActiveChecklist } from './active-checklist.entity';
import { ChecklistTemplate } from './checklist-template.entity';
import { CreateActiveChecklistDto } from './dto/create-active-checklist.dto';
import { UpdateActiveChecklistDto } from './dto/update-active-checklist.dto';
import { User } from '../users/user.entity';
export declare class ChecklistsService {
    private activeChecklistsRepository;
    private checklistTemplatesRepository;
    constructor(activeChecklistsRepository: Repository<ActiveChecklist>, checklistTemplatesRepository: Repository<ChecklistTemplate>);
    createActiveChecklist(createDto: CreateActiveChecklistDto, user: User): Promise<ActiveChecklist>;
    findAllActive(user: User, mda?: string): Promise<ActiveChecklist[]>;
    updateActiveChecklist(id: string, updateDto: UpdateActiveChecklistDto): Promise<ActiveChecklist>;
    findAllTemplates(): Promise<ChecklistTemplate[]>;
}
