import { UsersModule } from '../users/users.module';
import { BlogModule } from '../blog/blog.module';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, BlogModule],
  providers: [SeedService],
})
export class SeedModule {
}
