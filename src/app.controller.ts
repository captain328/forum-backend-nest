import { Controller, Get } from '@nestjs/common';

import { HealthResponse } from './common/models/health.response';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {

  @Get('health')
  @ApiOperation({ summary: 'Get if server is running or not.' })
  health() {
    return new HealthResponse();
  }
}
