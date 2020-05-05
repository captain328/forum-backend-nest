import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogEntity } from './entities/blog.entity';

@Module({
  providers: [BlogService],
  controllers: [BlogController],
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    UsersModule,
  ],
  exports: [BlogService],
})
export class BlogModule {
}
