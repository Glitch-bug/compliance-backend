// src/checklists/checklists.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveChecklist } from './active-checklist.entity';
import { ChecklistTemplate } from './checklist-template.entity';
import { CreateActiveChecklistDto } from './dto/create-active-checklist.dto';
import { UpdateActiveChecklistDto } from './dto/update-active-checklist.dto';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(ActiveChecklist)
    private activeChecklistsRepository: Repository<ActiveChecklist>,
    @InjectRepository(ChecklistTemplate)
    private checklistTemplatesRepository: Repository<ChecklistTemplate>,
  ) {}

  // --- Active Checklists ---
  async createActiveChecklist(createDto: CreateActiveChecklistDto, user: User): Promise<ActiveChecklist> {
    const template = await this.checklistTemplatesRepository.findOneBy({ id: createDto.templateId });
    if (!template) {
      throw new NotFoundException(`Template with ID "${createDto.templateId}" not found`);
    }

    const checklistItems = template.items.map(itemText => ({ text: itemText, completed: false }));

    const activeChecklist = this.activeChecklistsRepository.create({
      templateId: template.id,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      mda: user.mda,
      status: 'In Progress',
      items: checklistItems,
    });

    return this.activeChecklistsRepository.save(activeChecklist);
  }
  
  async findAllActive(user: User, mda?: string): Promise<ActiveChecklist[]> {
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'All MDAs') {
        return this.activeChecklistsRepository.find({ where: { mda: mda } });
      }else {
        return this.activeChecklistsRepository.find();
      }

    }
    return this.activeChecklistsRepository.find({ where: { mda: user.mda } });
  }

  async updateActiveChecklist(id: string, updateDto: UpdateActiveChecklistDto): Promise<ActiveChecklist> {
    const checklist = await this.activeChecklistsRepository.findOneBy({ id });
    if (!checklist) {
      throw new NotFoundException(`Checklist with ID "${id}" not found`);
    }

    checklist.items = updateDto.items;
    
    const isCompleted = checklist.items.every(item => item.completed);
    checklist.status = isCompleted ? 'Completed' : 'In Progress';

    return this.activeChecklistsRepository.save(checklist);
  }

  // --- Checklist Templates ---
  async findAllTemplates(): Promise<ChecklistTemplate[]> {
    return this.checklistTemplatesRepository.find();
  }
}
