import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: string;
    username: string;
    passwordHash: string;
    fullName: string;
    role: string;
    mda: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
