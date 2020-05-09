import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { BlogDto } from '../../blog/dtos/blog.dto';

export class CommentDto extends CommonDto {
  @ApiProperty({ description: 'content of the comment' })
  content: string;

  @ApiProperty({ type: () => UserDto, description: 'author of the blog' })
  author: UserDto;

  @ApiProperty({ type: () => BlogDto, description: 'the blog attached to' })
  blog: BlogDto;
}
