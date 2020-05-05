import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { BlogModule } from '../blog/blog.module';
import { CommentModule } from '../comment/comment.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, BlogModule, CommentModule],
  providers: [SeedService],
})
export class SeedModule {
}
