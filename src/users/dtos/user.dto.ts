import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums';
import { CommonDto } from '../../common/dtos/common.dto';
import { CommentDto } from '../../comment/dtos/comment.dto';
import { BlogDto } from '../../blog/dtos/blog.dto';

export class UserDto extends CommonDto {
  @ApiProperty({ description: `the user's full name` })
  fullName: string;

  @ApiProperty({ description: `the user's email address` })
  email: string;

  @ApiProperty({ type: 'enum', enum: UserRole, description: `the user's role` })
  role: UserRole;

  @ApiProperty({ type: () => CommentDto, isArray: true, description: `the comments written by this user` })
  comments: CommentDto[];

  @ApiProperty({ type: () => BlogDto, isArray: true, description: `the blogs written by this user` })
  blogs: BlogDto[];
}
