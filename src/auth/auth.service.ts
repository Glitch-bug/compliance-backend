import { Injectable, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/user.entity';
import { Role } from 'src/users/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyOptions } from 'typeorm';

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

    if (!user.isActive) {
          throw new UnauthorizedException('"Your account is either deactived or not verified. Please contact a system administrator."');
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

  async findAllPaginated(
    page: number,
    limit: number,
    status: string,
  ): Promise<{ data: User[]; total: number }> {
    const options: FindManyOptions<User> = {
      select: ['id', 'fullName', 'username', 'role', 'mda', 'isActive'],
      take: limit,
      skip: (page - 1) * limit,
      order: { fullName: 'ASC' }
    };

    if (status === 'active') {
      options.where = { isActive: true };
    } else if (status === 'pending') {
      options.where = { isActive: false };
    }
    
    const [data, total] = await this.usersRepository.findAndCount(options);
    return { data, total };
  }

  async findAll(active?: boolean): Promise<User[]> {
    if (active !== null) {
      return this.usersRepository.find({ where: { isActive: active } });
    } else {
      return this.usersRepository.find();
    }
  }

  async updateUserStatus(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    user.isActive = updateUserDto.isActive;
    await this.usersRepository.save(user);
    delete user.passwordHash;
    return user;
  }
}
