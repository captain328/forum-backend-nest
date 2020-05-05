import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { CommentDto } from '../../comment/dtos/comment.dto';
import { BlogDto } from '../../blog/dtos/blog.dto';

export class UserDto extends CommonDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: () => CommentDto, isArray: true })
  comments: CommentDto[];

  @ApiProperty({ type: () => BlogDto, isArray: true })
  blogs: BlogDto[];
}
