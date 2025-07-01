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

  @IsString()
  @IsNotEmpty({message: "MDA must be selected"})
  mda: string;
}
