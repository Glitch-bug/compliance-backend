import { IsString, MinLength, MaxLength, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../users/roles.enum';

/**
 * Defines the data structure and validation rules for creating a new user.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(20, { message: 'Password is too long (20 characters max)' })
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  mda: string;
}
