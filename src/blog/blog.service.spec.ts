import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { repositoryMockFactory } from '../mock/repository.mock';
import { BlogEntity } from './entities/blog.entity';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: getRepositoryToken(BlogEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
