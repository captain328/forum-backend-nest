import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { BlogDto } from '../dtos/blog.dto';

@Entity('blog')
export class BlogEntity extends SoftDelete {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, user => user.blogs)
  author: UserEntity;

  @OneToMany(() => CommentEntity, comment => comment.blog)
  comments: CommentEntity[];

  toDto(): BlogDto {
    return {
      ...super.toDto(),
      title: this.title,
      content: this.content,
      author: this.author?.toDto(),
      comments: this.comments?.map(comment => comment.toDto())
    };
  }
}
