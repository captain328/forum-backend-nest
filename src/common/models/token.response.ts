import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty()
  access_token: string;
}
