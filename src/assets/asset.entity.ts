// src/assets/asset.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;
  
  @Column({ name: 'acquired_date', type: 'date' })
  acquiredDate: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  value: number;

  @Column({ name: 'funding_source' })
  fundingSource: string;

  @Column()
  mda: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
