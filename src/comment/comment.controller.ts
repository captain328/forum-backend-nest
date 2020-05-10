import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
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
  @ApiParam({ name: 'bID', required: true, description: 'uuid of the blog to get' })
  @Get('blogs/:bID/comments')
  async comments(@Param('bID') bID: string): Promise<CommentDto[]> {
    const comments = await this.commentService.findByBlogId(bID);
    return comments.map(comment => comment.toDto());
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => CommentDto })
  @ApiOperation({ summary: 'Add comment to a blog' })
  @ApiBody({ type: AddCommentDto })
  @ApiParam({ name: 'bID', required: true, description: 'uuid of the blog to add a comment' })
  @UseGuards(JwtAuthGuard)
  @Post('blogs/:bID/comments')
  async addComment(@Request() request, @Param('bID') bID: string, @Body() dto: AddCommentDto): Promise<CommentDto> {
    const user = await this.userService.findById(request.user.id);
    const blog = await this.blogService.findById(bID);
    const comment = await this.commentService.add(user, blog, dto);
    return comment.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => CommentDto })
  @ApiOperation({ summary: 'Edit a comment' })
  @ApiBody({ type: AddCommentDto })
  @ApiParam({ name: 'bID', required: true, description: 'uuid of a blog that will contain the comment' })
  @ApiParam({ name: 'cID', required: true, description: 'uuid of the comment to update' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Moderator])
  @Put('blogs/:bID/comments/:cID')
  async updateComment(@Param('cID') cID: string, @Body() dto: AddCommentDto): Promise<CommentDto> {
    const comment = await this.commentService.update(cID, dto);
    return comment.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => SuccessResponse })
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'bID', required: true, description: 'uuid of a blog that containing the comment' })
  @ApiParam({ name: 'cID', required: true, description: 'uuid of the comment to delete' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Moderator])
  @Delete('blogs/:bID/comments/:cID')
  async deleteComment(@Param('cID') cID: string): Promise<SuccessResponse> {
    const comment = await this.commentService.findById(cID);
    if (!comment) {
      throw new BadRequestException('The comment does not exist.');
    }
    return this.commentService.delete(comment);
  }
}
