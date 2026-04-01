import { SetMetadata } from '@nestjs/common';
import type { Role } from 'generated/prisma/enums';

const ROLES_KEY = 'roles';
const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export { Roles, ROLES_KEY };
