import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../enums';

export class ChangeRoleDto {
  @ApiProperty({ description: 'target user id' })
  @IsUUID()
  id: string;

  @ApiProperty({ type: 'enum', enum: UserRole, description: 'target user role' })
  @IsEnum(UserRole)
  role: UserRole;
}
