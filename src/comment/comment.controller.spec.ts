import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CommentController } from './comment.controller';
import { UsersService } from '../users/users.service';
import { CommentService } from './comment.service';
import { BlogService } from '../blog/blog.service';
import { CommentEntity } from './entities/comment.entity';
import { repositoryMockFactory } from '../mock/repository.mock';
import { UserEntity } from '../users/entities/user.entity';
import { BlogEntity } from '../blog/entities/blog.entity';

describe('Comment Controller', () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        CommentService,
        BlogService,
        { provide: getRepositoryToken(CommentEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(BlogEntity), useFactory: repositoryMockFactory },
      ],
      controllers: [CommentController],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
