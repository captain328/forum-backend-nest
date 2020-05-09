import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({ description: 'health status of the server. always true' })
  success: boolean;

  constructor(success = true) {
    this.success = success;
  }
}
