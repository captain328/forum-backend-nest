import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogEntity } from './entities/blog.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AddBlogDto } from './dtos/add-blog.dto';
import { getFromDto } from '../common/utils/repository.util';
import { SuccessResponse } from '../common/models/success-response';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
  ) {
  }

  find(): Promise<BlogEntity[]> {
    return this.blogRepository.find();
  }

  findById(id: string): Promise<BlogEntity> {
    return this.blogRepository.findOne({ relations: ['comments'], where: { id } });
  }

  add(user: UserEntity, dto: AddBlogDto): Promise<BlogEntity> {
    const blog = getFromDto<BlogEntity>(dto, new BlogEntity());
    blog.author = user;
    return this.blogRepository.save(blog);
  }

  async update(id: string, dto: AddBlogDto): Promise<BlogEntity> {
    const found = await this.findById(id);
    if (!found) {
      throw new BadRequestException('Unable to find the requested blog');
    }
    const blog = getFromDto<BlogEntity>(dto, found);
    return this.blogRepository.save(blog);
  }

  async delete(blog): Promise<SuccessResponse> {
    const removed = await this.blogRepository.softRemove(blog);
    if (!removed) {
      throw new BadRequestException('Blog not found.');
    }
    return new SuccessResponse();
  }

  async count(): Promise<number> {
    return this.blogRepository.count();
  }
}
