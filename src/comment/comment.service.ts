import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './entities/comment.entity';
import { BlogEntity } from '../blog/entities/blog.entity';
import { getFromDto } from '../common/utils/repository.util';
import { AddCommentDto } from './dtos/add-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
  ) {
  }

  findByBlogId(id: string): Promise<CommentEntity[]> {
    return this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.blog', 'blog')
      .where('blog.id = :id', { id })
      .getMany();
  }

  add(blog: BlogEntity, dto: AddCommentDto): Promise<CommentEntity> {
    const comment = getFromDto<CommentEntity>(dto, new CommentEntity());
    comment.blog = blog;
    return this.commentRepository.save(comment);
  }

  count(): Promise<number> {
    return this.commentRepository.count();
  }
}
