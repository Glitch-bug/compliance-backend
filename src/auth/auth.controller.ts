import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/user.decorator';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
