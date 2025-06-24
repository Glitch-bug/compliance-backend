import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
    ) {}

    async findOneByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }
}
