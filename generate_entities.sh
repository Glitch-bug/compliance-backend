#!/bin/bash

# A script to generate boilerplate NestJS entity files.
#
# This script creates the directory `src/admin/entities` if it doesn't already exist,
# and then populates it with three entity files:
#   - funding-source.entity.ts
#   - budget-line.entity.ts
#   - risk-factor.entity.ts
#
# Each file contains a basic TypeORM entity definition with common fields.
#
# Usage:
#   1. Save this script as `generate_entities.sh` in the root of your NestJS project.
#   2. Make it executable: `chmod +x generate_entities.sh`
#   3. Run the script: `./generate_entities.sh`

# --- Configuration ---
# The target directory for the new entity files.
# The path is relative to the project root.
ENTITIES_DIR="src/admin/entities"

# --- Script Start ---
echo "Starting entity generation..."

# Create the directory if it doesn't exist
echo "Ensuring directory exists: $ENTITIES_DIR"
mkdir -p "$ENTITIES_DIR"

# --- 1. Create FundingSource Entity ---
echo "Creating FundingSource entity..."
cat <<EOF > "${ENTITIES_DIR}/funding-source.entity.ts"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
}
EOF

# --- 2. Create BudgetLine Entity ---
echo "Creating BudgetLine entity..."
cat <<EOF > "${ENTITIES_DIR}/budget-line.entity.ts"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
}
EOF

# --- 3. Create RiskFactor Entity ---
echo "Creating RiskFactor entity..."
cat <<EOF > "${ENTITIES_DIR}/risk-factor.entity.ts"
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
EOF

# --- Script End ---
echo ""
echo "✅ Entity generation complete!"
echo "The following files were created in ${ENTITIES_DIR}:"
echo "  - funding-source.entity.ts"
echo "  - budget-line.entity.ts"
echo "  - risk-factor.entity.ts"

