import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from 'bcrypt';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserRole } from '../enums';
import { UserDto } from '../dtos/user.dto';
import { BlogEntity } from '../../blog/entities/blog.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';

@Entity('user')
export class UserEntity extends SoftDelete {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => BlogEntity, blog => blog.author)
  blogs?: BlogEntity[];

  @OneToMany(() => CommentEntity, comment => comment.author)
  comments?: CommentEntity[];


  @BeforeInsert()
  preProcess() {
    return hash(this.password, 10).then(encrypted => this.password = encrypted);
  }

  toDto(): UserDto {
    return {
      ...super.toDto(),
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      blogs: this.blogs?.map(blog => blog.toDto()),
      comments: this.comments?.map(comment => comment.toDto())
    };
  }
}
