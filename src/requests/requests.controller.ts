import { Controller, Get, Post, Body, Patch, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('requests')
@UseGuards(AuthGuard())
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MDA'])
  create(@Body() createRequestDto: CreateRequestDto, @GetUser() user: User) {
    return this.requestsService.create(createRequestDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.requestsService.findAll(user);
  }
  
  @Get('/review')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MoF Compliance', 'IAA Auditor', 'Minister'])
  findForReview() {
    return this.requestsService.findForReview();
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['MoF Compliance', 'IAA Auditor', 'Minister'])
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto, @GetUser() user: User) {
    return this.requestsService.update(id, updateRequestDto, user);
  }
}
