import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from './entities/comment.entity';
import { BlogEntity } from '../blog/entities/blog.entity';
import { UserEntity } from '../users/entities/user.entity';
import { getFromDto } from '../common/utils/repository.util';
import { AddCommentDto } from './dtos/add-comment.dto';
import { SuccessResponse } from '../common/models/success-response';

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

  add(user: UserEntity, blog: BlogEntity, dto: AddCommentDto): Promise<CommentEntity> {
    const comment = getFromDto<CommentEntity>(dto, new CommentEntity());
    comment.blog = blog;
    comment.author = user;
    return this.commentRepository.save(comment);
  }

  async update(id: string, dto: AddCommentDto): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({ id });
    comment.content = dto.content;
    return this.commentRepository.save(comment);
  }

  async delete(comment: CommentEntity): Promise<SuccessResponse> {
    await this.commentRepository.softRemove(comment);
    return new SuccessResponse(true);
  }

  async deleteMany(comments: CommentEntity[]): Promise<SuccessResponse> {
    await this.commentRepository.softRemove(comments);
    return new SuccessResponse(true);
  }

  count(): Promise<number> {
    return this.commentRepository.count();
  }
}
