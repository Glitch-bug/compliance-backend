import { ActiveChecklist } from 'src/checklists/entity/active-checklist.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// To enable relationships, you might import other entities like this:
// import { FundingSource } from './funding-source.entity';
// import { ManyToOne } from 'typeorm';

@Entity('budget_lines')
export class BudgetLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, comment: 'The name or code for the budget line item' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: 'A detailed description of the budget line' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00, comment: 'The allocated amount for this line item' })
  amount: number;


  /*
  // Example of a Many-to-One relationship with FundingSource.
  // Don't forget to add a corresponding One-to-Many on the FundingSource entity.
  @ManyToOne(() => FundingSource)
  fundingSource: FundingSource;
  */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Inverse side of the relation
  @OneToMany(() => ActiveChecklist, (activeChecklist) => activeChecklist.budgetLine)
  active_checklists: ActiveChecklist[];
}
