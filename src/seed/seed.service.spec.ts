import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { UsersService } from '../users/users.service';
import { CommentService } from '../comment/comment.service';
import { BlogService } from '../blog/blog.service';
import { CommentEntity } from '../comment/entities/comment.entity';
import { repositoryMockFactory } from '../mock/repository.mock';
import { UserEntity } from '../users/entities/user.entity';
import { BlogEntity } from '../blog/entities/blog.entity';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        CommentService,
        BlogService,
        SeedService,
        { provide: getRepositoryToken(CommentEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(BlogEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
