import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private logger;
    constructor(usersRepository: UsersRepository, jwtService: JwtService);
    login(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
        user: any;
    }>;
}
