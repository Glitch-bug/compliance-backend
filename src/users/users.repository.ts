import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';


@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }


  
  /**
   * Creates a new user, hashes their password, and saves it to the database.
   * @param createUserDto - The user data to create.
   */
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, fullName, role, mda } = createUserDto;

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user entity instance
    const user = this.create({
      username,
      passwordHash: hashedPassword,
      fullName,
      role,
      mda,
    });

    try {
      // Save the new user to the database
      await this.save(user);
    } catch (error) {
      // Handle error for duplicate username
      if (error.code === '23505') { // 23505 is the PostgreSQL error code for unique violation
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ where: { username } });
    console.log(`user: ${user}`)
    if(!user){
      return null;
    }else{
      return user;
    }

    // if (user && await bcrypt.compare(password, user.passwordHash)) {
    //   return user;
    // } else {
    //   return null;
    // }
  }
}
