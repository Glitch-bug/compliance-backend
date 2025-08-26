import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Request as RequestEntity } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';
import { ActiveChecklist } from 'src/checklists/entity/active-checklist.entity';
import { ChecklistTemplate } from 'src/checklists/entity/checklist-template.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestsRepository: Repository<RequestEntity>,
    @InjectRepository(ActiveChecklist)
    private activeChecklistsRepository: Repository<ActiveChecklist>,
    @InjectRepository(ChecklistTemplate)
    private checklistTemplatesRepository: Repository<ChecklistTemplate>,
  ) { }

  async create(createRequestDto: CreateRequestDto, user: User): Promise<RequestEntity> {
    console.log(`come on!: ${user.mda}`);
    const request = this.requestsRepository.create({
      ...createRequestDto,
      mda: user.mda,
      createdById: user.id,
      status: createRequestDto.isJoint ? 'Awaiting Co-Submitter Approval' : 'Pending Review',
    });
    return this.requestsRepository.save(request);
  }

  async findAll(user: User, mda?: string): Promise<RequestEntity[]> {
    // const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];
    if (universalRoles.includes(user.role)) {
      if (mda && mda !== 'All MDAs') {
        return this.requestsRepository.find({ where: [{ mda: mda }, { partnerMda: mda }] });
      } else {
        return this.requestsRepository.find();
      }

    }
    return this.requestsRepository.find({ where: [{ mda: user.mda }, { partnerMda: user.mda }] });
  }

  async findForReview(): Promise<RequestEntity[]> {
    const statusesForReview = ['Pending Review', 'Awaiting Co-Submitter Approval'];
    return this.requestsRepository.find({ where: { status: In(statusesForReview) } });
  }

  async update(id: string, updateRequestDto: UpdateRequestDto, user: User): Promise<RequestEntity> {
    const request = await this.requestsRepository.findOneBy({ id });
    if (!request) {
      throw new Error('Request not found');
    }

    // Add new review comment instead of replacing
    if (updateRequestDto.reviewComments) {
      const newComment = { by: user.fullName, date: new Date().toISOString(), comment: updateRequestDto.reviewComments };
      request.reviewComments = request.reviewComments ? [...(request.reviewComments as Array<any>), newComment] : [newComment];
      // remove the raw comment from the DTO to prevent direct update
      delete updateRequestDto.reviewComments;
    }

    if (request.status === 'approved') {
      await this.createProjectChecklistForRequest(request);
    }


    Object.assign(request, updateRequestDto);
    return this.requestsRepository.save(request);
  }


  private async createProjectChecklistForRequest(request: RequestEntity): Promise<void> {
    const templateName = 'PROJECT';
    const template = await this.checklistTemplatesRepository.findOne({ where: { name: templateName } });

    if (!template) {
      console.warn(`Default project checklist template "${templateName}" not found. Skipping checklist creation.`);
      return;
    }

    const creationDate = new Date();
    const checklistItems = template.items.map(itemText => ({
      text: itemText,
      completed: false,
      lastUpdated: creationDate,
    }));

    const activeChecklist = this.activeChecklistsRepository.create({
      templateId: template.id,
      name: `Project: ${request.title}`,
      mda: request.mda,
      status: 'In Progress',
      items: checklistItems,
      createdAt: creationDate,
      request: request, // Associate the checklist with the request
    });

    await this.activeChecklistsRepository.save(activeChecklist);
  }



  async remove(id: string): Promise<void> {
    const result = await this.requestsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
  }
}
