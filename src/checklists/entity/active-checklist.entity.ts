// src/checklists/active-checklist.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ChecklistTemplate } from './checklist-template.entity';
import { BudgetLine } from 'src/admin/entities/budget-line.entity';
import { Request } from 'src/requests/request.entity';


export class ChecklistItem {
  text: string;
  completed: boolean;
  lastUpdated?: Date|null;
  amount?: number|null;
}

@Entity('active_checklists')
export class ActiveChecklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @ManyToOne(() => ChecklistTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ChecklistTemplate;

  @Column()
  name: string;

  @Column()
  mda: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb' })
  items: ChecklistItem[];
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


  @OneToOne(() => Request, (request) => request.active_checklist)
  @JoinColumn({ name: 'request_id' })
  request: Request;
}