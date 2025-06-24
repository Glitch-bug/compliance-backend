import { ChecklistTemplate } from './checklist-template.entity';
export declare class ActiveChecklist {
    id: string;
    templateId: string;
    template: ChecklistTemplate;
    name: string;
    mda: string;
    status: string;
    items: {
        text: string;
        completed: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
