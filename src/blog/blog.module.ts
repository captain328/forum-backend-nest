import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogEntity } from './entities/blog.entity';
import { CommentService } from '../comment/comment.service';
import { CommentEntity } from '../comment/entities/comment.entity';

@Module({
  providers: [BlogService, CommentService],
  controllers: [BlogController],
  imports: [
    TypeOrmModule.forFeature([BlogEntity, CommentEntity]),
    UsersModule,
  ],
  exports: [BlogService],
})
export class BlogModule {
}
