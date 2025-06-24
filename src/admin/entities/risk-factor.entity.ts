import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Using an enum for predefined risk levels is good practice.
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('risk_factors')
export class RiskFactor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, comment: 'A short name for the risk factor' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: 'A detailed description of the risk and its potential impact' })
  description: string;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
    comment: 'The assessed level of the risk',
  })
  level: RiskLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
