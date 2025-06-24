// src/checklists/checklists.controller.ts
import { Controller, Get, Post, Body, Patch, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChecklistsService } from './checklists.service';
import { CreateActiveChecklistDto } from './dto/create-active-checklist.dto';
import { UpdateActiveChecklistDto } from './dto/update-active-checklist.dto';

@Controller('checklists')
@UseGuards(AuthGuard())
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  // --- Active Checklists Routes ---
  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MDA'])
  createActive(@Body() createDto: CreateActiveChecklistDto, @GetUser() user: User) {
    return this.checklistsService.createActiveChecklist(createDto, user);
  }
  
  @Get()
  findAllActive(@GetUser() user: User) {
    return this.checklistsService.findAllActive(user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MDA'])
  updateActive(@Param('id') id: string, @Body() updateDto: UpdateActiveChecklistDto) {
    return this.checklistsService.updateActiveChecklist(id, updateDto);
  }

  // --- Templates Route ---
  @Get('/templates')
  findAllTemplates() {
    return this.checklistsService.findAllTemplates();
  }
}
