#!/bin/bash
# populate_modules.sh - Generates the full implementation for the Assets, Grants, and Checklists modules.
# Run this script inside the 'backend' directory created by 'create_backend.sh'.

echo "--- Populating Assets, Grants, and Checklists modules ---"

# Check if we are in the backend directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "Error: This script must be run from the root of the 'backend' project directory."
    exit 1
fi

# --- Grants Module ---
echo "Creating Grants module files..."
cat > src/grants/grant.entity.ts << 'EOF'
// src/grants/grant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('grants')
export class Grant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  donor: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @Column()
  mda: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
EOF

cat > src/grants/dto/create-grant.dto.ts << 'EOF'
// src/grants/dto/create-grant.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGrantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  donor: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
EOF

cat > src/grants/grants.service.ts << 'EOF'
// src/grants/grants.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { CreateGrantDto } from './dto/create-grant.dto';
import { User } from '../users/user.entity';

@Injectable()
export class GrantsService {
  constructor(
    @InjectRepository(Grant)
    private grantsRepository: Repository<Grant>,
  ) {}

  async create(createGrantDto: CreateGrantDto, user: User): Promise<Grant> {
    const grant = this.grantsRepository.create({
      ...createGrantDto,
      mda: user.mda,
      status: 'Active',
    });
    return this.grantsRepository.save(grant);
  }

  async findAll(user: User): Promise<Grant[]> {
    const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
    if (universalRoles.includes(user.role)) {
      return this.grantsRepository.find();
    }
    return this.grantsRepository.find({ where: { mda: user.mda } });
  }
}
EOF

cat > src/grants/grants.controller.ts << 'EOF'
// src/grants/grants.controller.ts
import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GrantsService } from './grants.service';
import { CreateGrantDto } from './dto/create-grant.dto';

@Controller('grants')
@UseGuards(AuthGuard())
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MDA'])
  create(@Body() createGrantDto: CreateGrantDto, @GetUser() user: User) {
    return this.grantsService.create(createGrantDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.grantsService.findAll(user);
  }
}
EOF

cat > src/grants/grants.module.ts << 'EOF'
// src/grants/grants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grant } from './grant.entity';
import { GrantsController } from './grants.controller';
import { GrantsService } from './grants.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grant]), AuthModule],
  controllers: [GrantsController],
  providers: [GrantsService],
})
export class GrantsModule {}
EOF

# --- Assets Module ---
echo "Creating Assets module files..."
cat > src/assets/asset.entity.ts << 'EOF'
// src/assets/asset.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;
  
  @Column({ name: 'acquired_date', type: 'date' })
  acquiredDate: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  value: number;

  @Column({ name: 'funding_source' })
  fundingSource: string;

  @Column()
  mda: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
EOF

cat > src/assets/dto/create-asset.dto.ts << 'EOF'
// src/assets/dto/create-asset.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDateString()
  @IsNotEmpty()
  acquiredDate: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  fundingSource: string;
}
EOF

cat > src/assets/assets.service.ts << 'EOF'
// src/assets/assets.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto, user: User): Promise<Asset> {
    const asset = this.assetsRepository.create({
      ...createAssetDto,
      mda: user.mda,
    });
    return this.assetsRepository.save(asset);
  }

  async findAll(user: User): Promise<Asset[]> {
    const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
    if (universalRoles.includes(user.role)) {
      return this.assetsRepository.find();
    }
    return this.assetsRepository.find({ where: { mda: user.mda } });
  }
}
EOF

cat > src/assets/assets.controller.ts << 'EOF'
// src/assets/assets.controller.ts
import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('assets')
@UseGuards(AuthGuard())
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MDA'])
  create(@Body() createAssetDto: CreateAssetDto, @GetUser() user: User) {
    return this.assetsService.create(createAssetDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.assetsService.findAll(user);
  }
}
EOF

cat > src/assets/assets.module.ts << 'EOF'
// src/assets/assets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), AuthModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
EOF


# --- Checklists Module ---
echo "Creating Checklists module files..."
cat > src/checklists/checklist-template.entity.ts << 'EOF'
// src/checklists/checklist-template.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('checklist_templates')
export class ChecklistTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'jsonb' })
  items: string[];

  @Column({ name: 'created_by_id', nullable: true })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
EOF

cat > src/checklists/active-checklist.entity.ts << 'EOF'
// src/checklists/active-checklist.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ChecklistTemplate } from './checklist-template.entity';

@Entity('active_checklists')
export class ActiveChecklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @ManyToOne(() => ChecklistTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ChecklistTemplate;

  @Column()
  name: string;

  @Column()
  mda: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb' })
  items: { text: string; completed: boolean }[];
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
EOF

cat > src/checklists/dto/create-active-checklist.dto.ts << 'EOF'
// src/checklists/dto/create-active-checklist.dto.ts
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateActiveChecklistDto {
  @IsUUID()
  @IsNotEmpty()
  templateId: string;
}
EOF

cat > src/checklists/dto/update-active-checklist.dto.ts << 'EOF'
// src/checklists/dto/update-active-checklist.dto.ts
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItemDto {
    text: string;
    completed: boolean;
}

export class UpdateActiveChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}
EOF

cat > src/checklists/checklists.service.ts << 'EOF'
// src/checklists/checklists.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveChecklist } from './active-checklist.entity';
import { ChecklistTemplate } from './checklist-template.entity';
import { CreateActiveChecklistDto } from './dto/create-active-checklist.dto';
import { UpdateActiveChecklistDto } from './dto/update-active-checklist.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ChecklistsService {
  constructor(
    @InjectRepository(ActiveChecklist)
    private activeChecklistsRepository: Repository<ActiveChecklist>,
    @InjectRepository(ChecklistTemplate)
    private checklistTemplatesRepository: Repository<ChecklistTemplate>,
  ) {}

  // --- Active Checklists ---
  async createActiveChecklist(createDto: CreateActiveChecklistDto, user: User): Promise<ActiveChecklist> {
    const template = await this.checklistTemplatesRepository.findOneBy({ id: createDto.templateId });
    if (!template) {
      throw new NotFoundException(`Template with ID "${createDto.templateId}" not found`);
    }

    const checklistItems = template.items.map(itemText => ({ text: itemText, completed: false }));

    const activeChecklist = this.activeChecklistsRepository.create({
      templateId: template.id,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      mda: user.mda,
      status: 'In Progress',
      items: checklistItems,
    });

    return this.activeChecklistsRepository.save(activeChecklist);
  }
  
  async findAllActive(user: User): Promise<ActiveChecklist[]> {
    const universalRoles = ['MoF Compliance', 'IAA Auditor', 'Minister', 'System Admin'];
    if (universalRoles.includes(user.role)) {
      return this.activeChecklistsRepository.find();
    }
    return this.activeChecklistsRepository.find({ where: { mda: user.mda } });
  }

  async updateActiveChecklist(id: string, updateDto: UpdateActiveChecklistDto): Promise<ActiveChecklist> {
    const checklist = await this.activeChecklistsRepository.findOneBy({ id });
    if (!checklist) {
      throw new NotFoundException(`Checklist with ID "${id}" not found`);
    }

    checklist.items = updateDto.items;
    
    const isCompleted = checklist.items.every(item => item.completed);
    checklist.status = isCompleted ? 'Completed' : 'In Progress';

    return this.activeChecklistsRepository.save(checklist);
  }

  // --- Checklist Templates ---
  async findAllTemplates(): Promise<ChecklistTemplate[]> {
    return this.checklistTemplatesRepository.find();
  }
}
EOF

cat > src/checklists/checklists.controller.ts << 'EOF'
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
EOF

cat > src/checklists/checklists.module.ts << 'EOF'
// src/checklists/checklists.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { ActiveChecklist } from './active-checklist.entity';
import { ChecklistTemplate } from './checklist-template.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActiveChecklist, ChecklistTemplate]), AuthModule],
  controllers: [ChecklistsController],
  providers: [ChecklistsService],
})
export class ChecklistsModule {}
EOF

# --- Admin Module ---
# This module will handle CRUD for the config tables like funding_sources
echo "Creating Admin module files..."
cat > src/admin/admin.module.ts << 'EOF'
// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { FundingSource } from './entities/funding-source.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { RiskFactor } from './entities/risk-factor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundingSource, BudgetLine, RiskFactor]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
EOF

cat > src/admin/entities/funding-source.entity.ts << 'EOF'
// src/admin/entities/funding-source.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('funding_sources')
export class FundingSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
EOF

cat > src/admin/entities/budget-line.entity.ts << 'EOF'
// src/admin/entities/budget-line.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('budget_lines')
export class BudgetLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
EOF

cat > src/admin/entities/risk-factor.entity.ts << 'EOF'
// src/admin/entities/risk-factor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('risk_factors')
export class RiskFactor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
  
  @Column()
  weight: number;
}
EOF

cat > src/admin/admin.service.ts << 'EOF'
// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundingSource } from './entities/funding-source.entity';
import { BudgetLine } from './entities/budget-line.entity';
import { RiskFactor } from './entities/risk-factor.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(FundingSource) private fundingSourceRepo: Repository<FundingSource>,
    @InjectRepository(BudgetLine) private budgetLineRepo: Repository<BudgetLine>,
    @InjectRepository(RiskFactor) private riskFactorRepo: Repository<RiskFactor>,
  ) {}

  // This service can be expanded to include create, update, delete for these entities
  async getSystemConfig() {
    const fundingSources = await this.fundingSourceRepo.find();
    const budgetLines = await this.budgetLineRepo.find();
    const riskFactors = await this.riskFactorRepo.find();
    return { fundingSources, budgetLines, riskFactors };
  }
}
EOF

cat > src/admin/admin.controller.ts << 'EOF'
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
EOF

echo "--- Module population complete. ---"
echo "You can now run 'npm run start:dev' to see the new endpoints."
