import { ApiProperty } from '@nestjs/swagger';

export class CommonDto {
  @ApiProperty({ description: 'UUID of the object' })
  id: string;

  @ApiProperty({ description: 'Created date of the object' })
  readonly createdAt: string;

  @ApiProperty({ description: 'Updated date of the object' })
  updatedAt: string;
}
