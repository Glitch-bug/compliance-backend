import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Request as RequestEntity } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestsRepository: Repository<RequestEntity>,
  ) { }

  async create(createRequestDto: CreateRequestDto, user: User): Promise<RequestEntity> {
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
      if (mda && mda !== 'National'){
        return this.requestsRepository.find({ where: { mda: mda }});
      }else {
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

    Object.assign(request, updateRequestDto);
    return this.requestsRepository.save(request);
  }
}
