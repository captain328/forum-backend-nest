import { Controller, Get } from '@nestjs/common';

import { HealthResponse } from './common/models/health.response';

@Controller()
export class AppController {

  @Get('health')
  health() {
    return new HealthResponse();
  }
}
