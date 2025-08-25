import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import {Request} from 'src/requests/request.entity';

@Entity('funding_sources')
export class FundingSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, comment: 'The name of the funding source' })
  name: string;

  @Column({ type: 'text', nullable: true, comment: 'A detailed description of the funding source' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Request, (request) => request.fundingSource)
  requests: Request[];
}
