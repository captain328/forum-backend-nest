import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CommentService } from './comment.service';
import { CommentDto } from './dtos/comment.dto';
import { AddCommentDto } from './dtos/add-comment.dto';
import { BlogService } from '../blog/blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { SuccessResponse } from '../common/models/success-response';

@ApiTags('Comment')
@Controller()
export class CommentController {
  constructor(
    private userService: UsersService,
    private commentService: CommentService,
    private blogService: BlogService,
  ) {
  }

  @ApiOkResponse({ type: () => CommentDto, isArray: true })
  @ApiOperation({ summary: 'Get all comments for the blog' })
  @ApiParam({ name: 'id', required: true })
  @Get('blog/:id/comment')
  async comments(@Param('id') id: string): Promise<CommentDto[]> {
    const comments = await this.commentService.findByBlogId(id);
    return comments.map(comment => comment.toDto());
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => CommentDto })
  @ApiOperation({ summary: 'Add comment to a blog' })
  @ApiBody({ type: AddCommentDto })
  @UseGuards(JwtAuthGuard)
  @Post('blog/:id/comment')
  async addComment(@Request() request, @Param('id') id: string, @Body() dto: AddCommentDto): Promise<CommentDto> {
    const user = await this.userService.findById(request.user.id);
    const blog = await this.blogService.findById(id);
    const comment = await this.commentService.add(user, blog, dto);
    return comment.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => CommentDto })
  @ApiOperation({ summary: 'Edit a comment' })
  @ApiBody({ type: AddCommentDto })
  @ApiParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Moderator])
  @Put('comment/:id')
  async updateComment(@Param('id') id: string, @Body() dto: AddCommentDto): Promise<CommentDto> {
    const comment = await this.commentService.update(id, dto);
    return comment.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => SuccessResponse })
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Moderator])
  @Delete('comment/:id')
  async deleteComment(@Param('id') id: string): Promise<SuccessResponse> {
    return this.commentService.delete(id);
  }
}
