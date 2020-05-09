import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { HealthResponse } from './common/models/health.response';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('health should return health response', function() {
    const result = appController.health();
    expect(result).toStrictEqual(new HealthResponse());
  });
});
