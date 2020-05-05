import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { BlogDto } from '../../blog/dtos/blog.dto';

export class CommentDto extends CommonDto {
  @ApiProperty()
  content: string;

  @ApiProperty({ type: () => UserDto })
  author: UserDto;

  @ApiProperty({ type: () => BlogDto })
  blog: BlogDto;
}
