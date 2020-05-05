import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { BlogEntity } from '../blog/entities/blog.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    TypeOrmModule.forFeature([BlogEntity, CommentEntity]),
  ],
})

export class CommentModule {
}
