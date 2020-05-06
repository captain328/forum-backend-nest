import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CommentService } from './comment.service';
import { repositoryMockFactory } from '../mock/repository.mock';
import { CommentEntity } from './entities/comment.entity';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(CommentEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
