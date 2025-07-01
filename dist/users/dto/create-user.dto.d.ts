import { Role } from '../roles.enum';
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    role?: Role;
    mda?: string;
}
