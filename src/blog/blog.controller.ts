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

import { BlogService } from './blog.service';
import { BlogDto } from './dtos/blog.dto';
import { AddBlogDto } from './dtos/add-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/enums';
import { SuccessResponse } from '../common/models/success-response';
import { CommentService } from '../comment/comment.service';

@ApiTags('Blog')
@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private commentService: CommentService,
    private userService: UsersService,
  ) {
  }

  @ApiOkResponse({ type: () => BlogDto, isArray: true })
  @ApiOperation({ summary: 'Get all blogs' })
  @Get()
  async all(): Promise<BlogDto[]> {
    const blogs = await this.blogService.find();
    return blogs.map(blog => blog.toDto());
  }

  @ApiOkResponse({ type: () => BlogDto })
  @ApiOperation({ summary: 'Get blog detail' })
  @ApiParam({ name: 'id', required: true, description: 'uuid of the blog to get' })
  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogDto> {
    const blog = await this.blogService.findById(id);
    return blog.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => BlogDto })
  @ApiOperation({ summary: 'Add a blog' })
  @ApiBody({ type: () => AddBlogDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addBlog(@Request() request, @Body() dto: AddBlogDto): Promise<BlogDto> {
    const user = await this.userService.findById(request.user.id);
    const blog = await this.blogService.add(user, dto);
    return blog.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: () => BlogDto })
  @ApiOperation({ summary: 'Edit a blog' })
  @ApiBody({ type: () => AddBlogDto })
  @ApiParam({ name: 'id', required: true, description: 'uuid of the blog to update' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Moderator])
  @Put(':id')
  async updateBlog(@Param('id') id: string, @Body() dto: AddBlogDto): Promise<BlogDto> {
    const blog = await this.blogService.update(id, dto);
    return blog.toDto();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SuccessResponse })
  @ApiOperation({ summary: 'Delete a blog' })
  @ApiParam({ name: 'id', required: true, description: 'uuid of the blog to delete' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Moderator])
  @Delete(':id')
  async deleteBlog(@Param('id') id: string): Promise<SuccessResponse> {
    const blog = await this.blogService.findById(id);
    if (!blog) {
      throw new BadRequestException('The blog does not exist.');
    }
    await this.commentService.deleteMany(blog.comments);
    return this.blogService.delete(blog);
  }
}
