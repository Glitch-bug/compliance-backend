// src/checklists/checklists.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveChecklist } from './entity/active-checklist.entity';
import { ChecklistTemplate } from './entity/checklist-template.entity';
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
  ) { }

  // --- Active Checklists ---
  async createActiveChecklist(createDto: CreateActiveChecklistDto, user: User): Promise<ActiveChecklist> {
    const template = await this.checklistTemplatesRepository.findOneBy({ id: createDto.templateId });
    if (!template) {
      throw new NotFoundException(`Template with ID "${createDto.templateId}" not found`);
    }

    const creationDate = new Date();
    // When creating a new checklist, initialize each item with a lastUpdated timestamp.
    const checklistItems = template.items.map(itemText => ({
      text: itemText,
      completed: false,
      lastUpdated: creationDate, // Default to the creation time of the checklist
    }));

    const activeChecklist = this.activeChecklistsRepository.create({
      templateId: template.id,
      name: `${createDto.name} - ${creationDate.toLocaleDateString()}`,
      mda: user.mda,
      status: 'In Progress',
      items: checklistItems,
      createdAt: creationDate,
    });

    return this.activeChecklistsRepository.save(activeChecklist);
  }



  async findAllActive(user: User, mda?: string): Promise<ActiveChecklist[]> {
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'All MDAs') {
        return this.activeChecklistsRepository.find({ where: { mda: mda } });
      } else {
        return this.activeChecklistsRepository.find();
      }

    }
    return this.activeChecklistsRepository.find({ where: { mda: user.mda } });
  }


  async findAllActiveExternal(mda?: string): Promise<{ status: string; message: string; data: ActiveChecklist[]; }> {
    if (mda && mda !== 'All MDAs') {
      const checklists = await this.activeChecklistsRepository.find({ where: { mda: mda } });
      return { status: "success", message: "Active checklists", data: checklists };
    }
    // If no specific MDA is requested, return all checklists.
    const checklists = await this.activeChecklistsRepository.find();
    return { status: "success", message: "Active checklists", data: checklists };
  }

  async updateActiveChecklist(
    id: string,
    updateDto: UpdateActiveChecklistDto
  ): Promise<ActiveChecklist> {
    const checklist = await this.activeChecklistsRepository.findOneBy({ id });
    if (!checklist) {
      throw new NotFoundException(`Checklist with ID "${id}" not found`);
    }

    const now = new Date();

    const updatedItems = checklist.items.map((existingItem, index) => {
      const incomingItem = updateDto.items[index];

      // Default amount to 0.0 if missing
      const amount = incomingItem.amount ?? 0.0;

      // Build the new item starting from incoming values
      const newItem = {
        ...incomingItem,
        amount,
      };

      // Update timestamp only if completed or amount changed
      if (
        existingItem.completed !== incomingItem.completed ||
        (existingItem.amount ?? 0.0) !== amount
      ) {
        newItem.lastUpdated = now;
      } else {
        newItem.lastUpdated = existingItem.lastUpdated;
      }

      return newItem;
    });

    checklist.items = updatedItems;

    // Update checklist status based on all items completion
    const isCompleted = checklist.items.every(item => item.completed);
    checklist.status = isCompleted ? 'Completed' : 'In Progress';

    return this.activeChecklistsRepository.save(checklist);
  }

  // --- Checklist Templates ---
  async findAllTemplates(): Promise<ChecklistTemplate[]> {
    return this.checklistTemplatesRepository.find();
  }
}
