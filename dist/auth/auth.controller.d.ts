import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../users/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    getProfile(user: User): {
        id: string;
        username: string;
        fullName: string;
        role: import("../users/roles.enum").Role;
        mda: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}
