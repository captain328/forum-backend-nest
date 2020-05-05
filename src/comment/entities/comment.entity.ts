import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { BlogEntity } from '../../blog/entities/blog.entity';
import { CommentDto } from '../dtos/comment.dto';

@Entity('comment')
export class CommentEntity extends SoftDelete {
  @Column()
  content: string;

  @ManyToOne(() => UserEntity, user => user.comments)
  author: UserEntity;

  @ManyToOne(() => BlogEntity, blog => blog.comments)
  blog: BlogEntity;

  toDto(): CommentDto {
    return {
      ...super.toDto(),
      content: this.content,
      author: this.author?.toDto(),
      blog: this.blog?.toDto()
    };
  }
}
