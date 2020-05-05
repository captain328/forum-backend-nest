import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../../users/enums';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);
