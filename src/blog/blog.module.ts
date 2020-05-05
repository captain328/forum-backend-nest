import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogEntity } from './entities/blog.entity';

@Module({
  providers: [BlogService],
  controllers: [BlogController],
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
  ],
})
export class BlogModule {
}
