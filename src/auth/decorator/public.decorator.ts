import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/roles.enum';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);