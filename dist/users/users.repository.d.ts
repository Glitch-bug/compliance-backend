import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
export declare class UsersRepository extends Repository<User> {
    private dataSource;
    constructor(dataSource: DataSource);
    validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User | null>;
}
