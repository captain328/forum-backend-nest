import { ApiProperty } from '@nestjs/swagger';

export class CommonDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  readonly createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
