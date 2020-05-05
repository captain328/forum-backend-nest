import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { CommentDto } from '../../comment/dtos/comment.dto';

export class BlogDto extends CommonDto{
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: () => UserDto })
  author: UserDto;

  @ApiProperty({ type: () => CommentDto, isArray: true })
  comments: CommentDto[];
}
