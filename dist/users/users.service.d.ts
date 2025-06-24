import { User } from './user.entity';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: UsersRepository);
    findOneByUsername(username: string): Promise<User | undefined>;
}
