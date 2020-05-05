import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BlogService } from './blog.service';
import { BlogDto } from './dtos/blog.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(
    private blogService: BlogService,
  ) {
  }

  @ApiOkResponse({ type: () => BlogDto, isArray: true })
  @ApiOperation({ summary: 'Get all blogs' })
  @Get('all')
  async all(): Promise<BlogDto[]> {
    const blogs = await this.blogService.find();
    return blogs.map(blog => blog.toDto());
  }
}
