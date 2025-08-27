// src/grants/grant.entity.ts
import { BudgetLine } from 'src/admin/entities/budget-line.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('grants')
export class Grant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  donor: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @Column()
  mda: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


  // ✅ Raw FK column
  @Column({ name: 'budget_line_id', type: 'uuid', nullable: true })
  budgetLineId: string;
  
  @ManyToOne(() => BudgetLine, (budgetLine) => budgetLine.grants)
  @JoinColumn({ name: 'budget_line_id' })
  budgetLine: BudgetLine;
  
}
