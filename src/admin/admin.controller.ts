// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, SetMetadata, Query} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

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
  // Add POST, PATCH, DELETE endpoints here for managing config items
  // and protect them with the 'System Admin' role.
}
