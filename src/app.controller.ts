import { Controller, Get } from '@nestjs/common';

import { HealthResponse } from './common/models/health.response';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {

  @Get('health')
  @ApiOperation({ summary: 'Get if server is running or not' })
  @ApiOkResponse({ type: () => HealthResponse })
  health(): HealthResponse {
    return new HealthResponse();
  }
}
