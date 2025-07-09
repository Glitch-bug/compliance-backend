import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('budgets')
@Unique(['mda', 'fundingSource', 'budgetLine', 'fiscalYear'])
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mda: string;

  @Column()
  fundingSource: string;

  @Column()
  budgetLine: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  fiscalYear: number;
}
