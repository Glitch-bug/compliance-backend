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
