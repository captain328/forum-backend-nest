import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './enums';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('user')
export class UsersController {

  constructor(
    private userService: UsersService,
  ) {
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change role of the user. Only admin users can hava access to this api' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Put('change-role')
  async changeRole(@Body() dto: ChangeRoleDto): Promise<UserDto> {
    let user = await this.userService.findById(dto.id);
    user.role = dto.role;
    user = await this.userService.updateUser(user);
    return user.toDto();
  }
}
