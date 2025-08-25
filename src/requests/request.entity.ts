// src/requests/request.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { ActiveChecklist } from 'src/checklists/entity/active-checklist.entity';
import { BudgetLine } from 'src/admin/entities/budget-line.entity';
import { FundingSource } from 'src/admin/entities/funding-source.entity';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  mda: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'submitted_date' })
  submittedDate: Date;

  @UpdateDateColumn({ name: 'last_updated' })
  lastUpdated: Date;

  @Column({ name: 'created_by_id', nullable: true })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ type: 'jsonb', nullable: true })
  documents: any;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'local_content_percentage', nullable: true })
  localContentPercentage: number;

  @Column({ name: 'is_joint', default: false })
  isJoint: boolean;

  @Column({ name: 'partner_mda', nullable: true })
  partnerMda: string;

  @Column({ name: 'mda_contribution', type: 'numeric', precision: 15, scale: 2, nullable: true })
  mdaContribution: number;

  @Column({ name: 'partner_contribution', type: 'numeric', precision: 15, scale: 2, nullable: true })
  partnerContribution: number;

  @Column({ name: 'review_comments', type: 'jsonb', nullable: true })
  reviewComments: any;

  @Column({ name: 'risk_score', nullable: true })
  riskScore: number;

  @Column({ name: 'risk_analysis', nullable: true })
  riskAnalysis: string;

  @OneToOne(() => ActiveChecklist, (activeChecklist) => activeChecklist.request)
  active_checklist: ActiveChecklist;

  // ✅ Raw FK column
  @Column({ name: 'budget_line_id', type: 'uuid', nullable: true })
  budgetLineId: string;
  
  @ManyToOne(() => BudgetLine, (budgetLine) => budgetLine.requests)
  @JoinColumn({ name: 'budget_line_id' })
  budgetLine: BudgetLine;


  @Column({ name: 'funding_source_id', type: 'uuid', nullable: true })
  fundingSourceId: string;
  
  @ManyToOne(() => FundingSource, (fundingSource) => fundingSource.requests)
  @JoinColumn({ name: 'funding_source_id' })
  fundingSource: FundingSource;
}
