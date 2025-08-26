import { Controller, Get, Post, Body, Patch, Param, UseGuards, SetMetadata, Query, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
// import { User } from '../users/user.entity';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/users/roles.enum';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { User } from 'src/users/user.entity';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['MDA'])
  create(@Body() createRequestDto: CreateRequestDto, @GetUser() user: User) {
    console.log(`Lets go people ${user}`);
    return this.requestsService.create(createRequestDto, user);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(@GetUser() user: User, @Query('mda') mda?: string) {
    return this.requestsService.findAll(user, mda);
  }

  @Get('/review')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['MoF Compliance', 'IAA Auditor', 'Minister'])
  findForReview() {
    return this.requestsService.findForReview("notexternal");
  }

  @Get('/review/external')
  @UseGuards(ApiKeyGuard)
  findForReviewExternal() {
    return this.requestsService.findForReview("external");
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', ['MoF Compliance', 'IAA Auditor', 'Minister', 'MDA'])
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto, @GetUser() user: User) {
    return this.requestsService.update(id, updateRequestDto, user);
  }

  @Patch('/external/:id')
  @UseGuards(ApiKeyGuard)
  updateExternal(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto,) {
    return this.requestsService.updateExternal(id, updateRequestDto,);
  }

  @Delete('/:id')
  @UseGuards(ApiKeyGuard)
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }

  @Delete('/delete/:id')
  @UseGuards(ApiKeyGuard)
  @SetMetadata('roles', [Role.Admin])
  @HttpCode(HttpStatus.NO_CONTENT)
  removeRequest(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }
}
