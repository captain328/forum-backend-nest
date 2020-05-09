import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ description: 'content of the comment to add' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
