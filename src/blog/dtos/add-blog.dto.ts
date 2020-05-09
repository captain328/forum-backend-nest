import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddBlogDto {
  @ApiProperty({ description: 'title of the blog to add' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'content of the blog to add' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
