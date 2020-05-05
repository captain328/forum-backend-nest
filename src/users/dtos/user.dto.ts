import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';

export class UserDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: 'enum', enum: UserRole })
  role: UserRole;
}
