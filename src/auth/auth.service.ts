import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto'; 
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) { }


    /**
   * Handles user creation by calling the repository.
   * @param createUserDto - The user data to create.
   */
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    // The actual creation logic (hashing password, saving to DB)
    // is expected to be in the UsersRepository.
    return this.usersRepository.createUser(createUserDto);
  }





  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, user: any }> {
    const universalRoles: Role[] = [Role.MoF, Role.IAA, Role.Minister, Role.Admin];

    const user = await this.usersRepository.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isUniversal = universalRoles.includes(user.role);
    this.logger.debug(`universal ${isUniversal} role ${user.role}`);

    // If user is not universal, they must match the selected MDA
    if (!isUniversal && user.mda != authCredentialsDto.mda) {
      throw new UnauthorizedException('You can only access your assigned MDA');
    }

    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    const userProfile = {
      ...user,
      activeMda: authCredentialsDto.mda, // use selected MDA
    };

    return { accessToken, user: userProfile };
  }

}
