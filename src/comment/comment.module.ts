import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogModule } from '../blog/blog.module';
import { UsersModule } from '../users/users.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { BlogEntity } from '../blog/entities/blog.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    BlogModule,
    UsersModule,
    TypeOrmModule.forFeature([BlogEntity, CommentEntity]),
  ],
  exports: [CommentService],
})

export class CommentModule {
}
