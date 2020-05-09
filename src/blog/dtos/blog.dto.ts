import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { CommentDto } from '../../comment/dtos/comment.dto';

export class BlogDto extends CommonDto{
  @ApiProperty({ description: 'title of the blog' })
  title: string;

  @ApiProperty({ description: 'content of the blog' })
  content: string;

  @ApiProperty({ type: () => UserDto, description: 'author of the blog' })
  author: UserDto;

  @ApiProperty({ type: () => CommentDto, isArray: true, description: 'comments attached to the blog' })
  comments: CommentDto[];
}
