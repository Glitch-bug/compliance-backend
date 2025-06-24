import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    } else {
      return null;
    }
  }
}
