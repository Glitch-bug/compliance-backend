import { User } from '../users/user.entity';
export declare class ChecklistTemplate {
    id: string;
    name: string;
    items: string[];
    createdById: string;
    createdBy: User;
    createdAt: Date;
}
