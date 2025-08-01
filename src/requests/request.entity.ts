import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

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

  @Column({ name: 'funding_source' })
  fundingSource: string;

  @Column({ name: 'budget_line', nullable: true })
  budgetLine: string;

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
}
