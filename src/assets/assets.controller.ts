// src/assets/assets.controller.ts
import { Controller, Get, Post, Body, UseGuards, SetMetadata, Query, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Role } from 'src/users/roles.enum';
import { Roles } from 'src/auth/decorator/public.decorator';


@Controller('assets')
@UseGuards(AuthGuard())
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MDA'])
  create(@Body() createAssetDto: CreateAssetDto, @GetUser() user: User) {
    return this.assetsService.create(createAssetDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User, @Query('mda') mda?: string): Promise<any[]> {
    const assets = await this.assetsService.findAll(user, mda);
    return assets.map(asset => ({
      ...asset,
      fundingSourceName: asset.fundingSourceName, // expose in response
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const asset = await this.assetsService.findOne(id);
    return {
      ...asset,
      fundingSourceName: asset.fundingSourceName,
    };
  }
  // @Patch(':id')
  // @Roles(Role.Admin, Role.Minister)
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetsService.update(id, updateAssetDto);
  // }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}
