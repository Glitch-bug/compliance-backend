import { BaseEntity } from 'typeorm';
import { Role } from './roles.enum';
export declare class User extends BaseEntity {
    id: string;
    username: string;
    passwordHash: string;
    fullName: string;
    role: Role;
    mda: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
