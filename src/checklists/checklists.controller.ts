// src/checklists/checklists.controller.ts
import { Controller, Get, Post, Body, Patch, Param, UseGuards, SetMetadata, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChecklistsService } from './checklists.service';
import { CreateActiveChecklistDto } from './dto/create-active-checklist.dto';
import { UpdateActiveChecklistDto } from './dto/update-active-checklist.dto';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  // --- Active Checklists Routes ---
  @Post()
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  @SetMetadata('roles', ['MDA'])
  createActive(@Body() createDto: CreateActiveChecklistDto, @GetUser() user: User) {
    return this.checklistsService.createActiveChecklist(createDto, user);
  }
  
  @Get()
  @UseGuards(AuthGuard())
  findAllActive(@GetUser() user: User, @Query('mda') mda?: string) {
    return this.checklistsService.findAllActive(user, mda);
  }


  @Get('/external')
  @UseGuards(ApiKeyGuard)
  findAllActiveExternal(@Query('mda') mda?: string) {
    return this.checklistsService.findAllActiveExternal(mda);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  @SetMetadata('roles', ['MDA'])
  updateActive(@Param('id') id: string, @Body() updateDto: UpdateActiveChecklistDto) {
	  console.log(`update DTO : ${JSON.stringify(updateDto)}`);
    return this.checklistsService.updateActiveChecklist(id, updateDto);
  }

  // --- Templates Route ---
  @Get('/templates')
  @UseGuards(AuthGuard())
  findAllTemplates() {
    return this.checklistsService.findAllTemplates();
  }
}
