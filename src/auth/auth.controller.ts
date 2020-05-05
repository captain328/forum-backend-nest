import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDto } from '../users/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { TokenResponse } from '../common/models/token.response';

import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) {
  }

  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: TokenResponse })
  @Post('login')
  async login(@Request() req, @Body() dto: LoginDto): Promise<TokenResponse> {
    return this.authService.login(req.user);
  }

  @ApiOkResponse({ type: TokenResponse })
  @ApiOperation({ summary: 'Register a general user with "USER" role.' })
  @Post('register')
  register(@Body() dto: RegisterUserDto): Promise<TokenResponse> {
    return this.authService.registerUser(dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<UserDto> {
    return this.authService.profileFromUserId(req.user.id);
  }
}
