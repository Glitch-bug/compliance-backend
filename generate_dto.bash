#!/bin/bash

# A script to generate boilerplate NestJS DTO files for various modules.
#
# This script creates the directories `src/auth/dto` and `src/admin/dto`
# if they don't already exist. It then populates them with standard DTO files
# for authentication and for CRUD operations on the admin entities.
#
# The DTOs include validation using the class-validator library.
#
# Usage:
#   1. Save this script as `generate_dtos.sh` in the root of your NestJS project.
#   2. Make it executable: `chmod +x generate_dtos.sh`
#   3. Run the script: `./generate_dtos.sh`

# --- Configuration ---
AUTH_DTO_DIR="src/auth/dto"
ADMIN_DTO_DIR="src/admin/dto"

# --- Script Start ---
echo "Starting DTO generation..."

# Create the directories if they don't exist
echo "Ensuring directories exist..."
mkdir -p "$AUTH_DTO_DIR"
mkdir -p "$ADMIN_DTO_DIR"

# --- 1. Create Auth DTO ---
echo "Creating Auth DTOs in ${AUTH_DTO_DIR}..."
cat <<EOF > "${AUTH_DTO_DIR}/auth-credentials.dto.ts"
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for user authentication credentials.
 * Includes validation rules for the properties.
 */
export class AuthCredentialsDto {
  @IsString()
  @IsNotEmpty({ message: 'Username should not be empty.' })
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long.' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long.' })
  password: string;
}
EOF

# --- 2. Create Admin DTOs ---
echo "Creating Admin DTOs in ${ADMIN_DTO_DIR}..."

# --- FundingSource DTOs ---
cat <<EOF > "${ADMIN_DTO_DIR}/create-funding-source.dto.ts"
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateFundingSourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
EOF

cat <<EOF > "${ADMIN_DTO_DIR}/update-funding-source.dto.ts"
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateFundingSourceDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
// Note: For more complex applications, you could use @nestjs/mapped-types
// and extend the Create DTO, like so:
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateFundingSourceDto } from './create-funding-source.dto';
// export class UpdateFundingSourceDto extends PartialType(CreateFundingSourceDto) {}
EOF

# --- BudgetLine DTOs ---
cat <<EOF > "${ADMIN_DTO_DIR}/create-budget-line.dto.ts"
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateBudgetLineDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
EOF

cat <<EOF > "${ADMIN_DTO_DIR}/update-budget-line.dto.ts"
import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class UpdateBudgetLineDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;
}
EOF


# --- RiskFactor DTOs ---
# First, create a shared enum file to avoid duplication
cat <<EOF > "${ADMIN_DTO_DIR}/risk-level.enum.ts"
// This enum can be shared between DTOs and Entities
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
EOF

cat <<EOF > "${ADMIN_DTO_DIR}/create-risk-factor.dto.ts"
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RiskLevel } from './risk-level.enum';

export class CreateRiskFactorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RiskLevel)
  @IsNotEmpty()
  level: RiskLevel;
}
EOF

cat <<EOF > "${ADMIN_DTO_DIR}/update-risk-factor.dto.ts"
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RiskLevel } from './risk-level.enum';

export class UpdateRiskFactorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RiskLevel)
  @IsOptional()
  level?: RiskLevel;
}
EOF

# --- Script End ---
echo ""
echo "✅ DTO generation complete!"
echo ""
echo "Files created in ${AUTH_DTO_DIR}:"
echo "  - auth-credentials.dto.ts"
echo ""
echo "Files created in ${ADMIN_DTO_DIR}:"
echo "  - risk-level.enum.ts"
echo "  - create-funding-source.dto.ts"
echo "  - update-funding-source.dto.ts"
echo "  - create-budget-line.dto.ts"
echo "  - update-budget-line.dto.ts"
echo "  - create-risk-factor.dto.ts"
echo "  - update-risk-factor.dto.ts"

