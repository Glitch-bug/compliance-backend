// src/admin/admin.controller.ts
import { Controller, Get, UseGuards, SetMetadata, Query, Post, Body, ValidationPipe, Patch, Param} from '@nestjs/common';
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
    if (createBudgetLineDto.id == null){
      return this.adminService.createBudgetLine(createBudgetLineDto);
    } else {
      return this.adminService.incrementBudgetLineAmountWithCreateDto(createBudgetLineDto);
    }

  }
  // Add POST, PATCH, DELETE endpoints here for managing config items
  // and protect them with the 'System Admin' role.
}
