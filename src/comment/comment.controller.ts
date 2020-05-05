import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CommentService } from './comment.service';
import { CommentDto } from './dtos/comment.dto';
import { AddCommentDto } from './dtos/add-comment.dto';
import { BlogService } from '../blog/blog.service';

@ApiTags('Comment')
@Controller('blog')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private blogService: BlogService,
  ) {
  }

  @ApiOkResponse({ type: () => CommentDto, isArray: true })
  @ApiOperation({ summary: 'Get all comments for the blog' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id/comment')
  async comments(@Param('id') id: string): Promise<CommentDto[]> {
    const comments = await this.commentService.findByBlogId(id);
    return comments.map(comment => comment.toDto());
  }

  @ApiOkResponse({ type: () => CommentDto })
  @ApiOperation({ summary: 'Add comment to a blog' })
  @ApiBody({ type: AddCommentDto })
  @Post(':id/comment')
  async add(@Param('id') id: string, @Body() dto: AddCommentDto): Promise<CommentDto> {
    const blog = await this.blogService.findById(id);
    const comment = await this.commentService.add(blog, dto);
    return comment.toDto();
  }
}
