// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard(), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/system-config')
  @SetMetadata('roles', ['MDA', 'MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'])
  getSystemConfig() {
    return this.adminService.getSystemConfig();
  }
  
  // Add POST, PATCH, DELETE endpoints here for managing config items
  // and protect them with the 'System Admin' role.
}
