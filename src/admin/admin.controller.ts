// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, SetMetadata, Query, Post, Body, ValidationPipe, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';
import { UpdateAmountDto } from './dto/update-amount.dto';
import { CreateRiskFactorDto } from './dto/create-risk-factor.dto';
import { CreateFundingSourceDto } from './dto/create-funding-source.dto';

@Controller('admin')

export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('/system-config')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['MDA', 'MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'])
  getSystemConfig() {
    return this.adminService.getSystemConfig();
  }

  @Get('/budget-lines')
  @UseGuards(ApiKeyGuard)
  getBudgetLines(@Query('mda') mda?: string) {
    return this.adminService.getBudgetLine(mda);
  }

  @Post('/budget-lines')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['System Admin'])
  createBudgetLine(@Body(ValidationPipe) createBudgetLineDto: CreateBudgetLineDto) {
    return this.adminService.createBudgetLine(createBudgetLineDto);
  }

  @Post('/risk-factor')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['System Admin'])
  createRiskFactor(@Body(ValidationPipe) createRiskFactorDto: CreateRiskFactorDto) {
    return this.adminService.createRiskFactor(createRiskFactorDto);
  }

  @Post('/funding-source')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['System Admin'])
  createFundingSource(@Body(ValidationPipe) createFundingSourceDto: CreateFundingSourceDto) {
    return this.adminService.createFundingSource(createFundingSourceDto);
  }


  /**
   * Updates the amount of a specific Budget Line by adding to its current value.
   * Now protected by ApiKeyGuard for M2M communication.
   */
  @Patch('/budget-lines/:id/increment')
  @UseGuards(ApiKeyGuard)
  incrementBudgetLineAmount(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAmountDto: UpdateAmountDto,
  ) {
    return this.adminService.incrementBudgetLineAmount(id, updateAmountDto.amount);
  }



  @Post('/budget-lines/external')
  @UseGuards(ApiKeyGuard)
  createBudgetLineExternal(@Body(ValidationPipe) createBudgetLineDto: CreateBudgetLineDto) {
    console.log(`create? ${createBudgetLineDto.id}`);
    if (createBudgetLineDto.id == null) {
      console.log(`created`);
      return this.adminService.createBudgetLine(createBudgetLineDto);
    } else {
      console.log(`updated`);
      return this.adminService.incrementBudgetLineAmountWithCreateDto(createBudgetLineDto);
    }

  }
  // Add POST, PATCH, DELETE endpoints here for managing config items
  // and protect them with the 'System Admin' role.


  // --- Delete Endpoints ---

  @Delete('/funding-sources/:id')
  @SetMetadata('roles', ['System Admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFundingSource(@Param('id') id: string): Promise<void> {
    return this.adminService.deleteFundingSource(id);
  }

  @Delete('/budget-lines/:id')
  @SetMetadata('roles', ['System Admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBudgetLine(@Param('id') id: string): Promise<void> {
    return this.adminService.deleteBudgetLine(id);
  }

  @Delete('/risk-factors/:id')
  @SetMetadata('roles', ['System Admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteRiskFactor(@Param('id') id: string): Promise<void> {
    return this.adminService.deleteRiskFactor(id);
  }
}
