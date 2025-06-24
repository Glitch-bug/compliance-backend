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
