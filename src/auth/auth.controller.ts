import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Req, Query, SetMetadata, Put, Param, DefaultValuePipe, ParseIntPipe, Patch, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { Role } from 'src/users/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
 * Endpoint for creating/signing up a new user.
 * @param createUserDto - Validated user creation data.
 */
  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: any }> {
    return this.authService.login(authCredentialsDto);
  }



  @Get('/profile')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: User) {
    // We remove the password before sending the user object back
    const { passwordHash, ...result } = user;
    return result;
  }

  @Get('/list')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', [Role.Admin])
  listUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status', new DefaultValuePipe('all')) status: string,
  ) {
    return this.authService.findAllPaginated(page, limit, status);
  }

  @Patch('/status/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @SetMetadata('roles', [Role.Admin])
  updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.authService.updateUserStatus(id, updateUserDto);
  }
}
