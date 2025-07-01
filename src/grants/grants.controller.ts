// src/grants/grants.controller.ts
import { Controller, Get, Post, Body, UseGuards, SetMetadata, Param, Delete, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GrantsService } from './grants.service';
import { CreateGrantDto } from './dto/create-grant.dto';
import { Role } from 'src/users/roles.enum';
import { Roles } from 'src/auth/decorator/public.decorator';


@Controller('grants')
@UseGuards(AuthGuard())
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) { }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grantsService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.grantsService.remove(id);
  }
}
