// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, SetMetadata, Query, Post, Body, ValidationPipe} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';

@Controller('admin')

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/system-config')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['MDA', 'MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'])
  getSystemConfig() {
    return this.adminService.getSystemConfig();
  }

  @Get('/budget-lines')
  @UseGuards(ApiKeyGuard)
  getBudgetLines(@Query('mda') mda?: string) {
    return this.adminService.getBudgetLines();
  }

  @Post('/budget-lines')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['System Admin'])
  createBudgetLine(@Body(ValidationPipe) createBudgetLineDto: CreateBudgetLineDto) {
    return this.adminService.createBudgetLine(createBudgetLineDto);
  }


  @Post('/budget-lines/external')
  @UseGuards(ApiKeyGuard)
  createBudgetLineExternal(@Body(ValidationPipe) createBudgetLineDto: CreateBudgetLineDto) {
    return this.adminService.createBudgetLine(createBudgetLineDto);
  }
  // Add POST, PATCH, DELETE endpoints here for managing config items
  // and protect them with the 'System Admin' role.
}
