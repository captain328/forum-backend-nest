import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Faker from 'faker';

import { CommentService } from './comment.service';
import { MockType, repositoryMockFactory } from '../mock/repository.mock';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: MockType<Repository<CommentEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(CommentEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get(getRepositoryToken(CommentEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('count should call repository count method', async () => {
    commentRepository.count = jest.fn().mockImplementation(() => new Promise(resolve => resolve(0)));
    const spy = jest.spyOn(commentRepository, 'count');
    await service.count();
    expect(spy).toHaveBeenCalled();
  });

  it('findById should call repository findOne method', async () => {
    const id = Faker.random.uuid();
    commentRepository.findOne = jest.fn().mockImplementation(() => new Promise(resolve => resolve(0)));
    const spy = jest.spyOn(commentRepository, 'findOne');
    await service.findById(id);
    expect(spy).toHaveBeenCalledWith({ id });
  });

  it('delete, deleteMany should call repository softRemove method', async () => {
    const comment = new CommentEntity();
    commentRepository.softRemove = jest.fn().mockImplementation(() => new Promise(resolve => resolve(comment)));
    const spy = jest.spyOn(commentRepository, 'softRemove');
    await service.deleteMany([comment]);
    await service.delete(comment);
    expect(spy).toHaveBeenCalled();
  });

  it('update should call repository save method', async () => {
    const id = Faker.random.uuid();
    const comment = new CommentEntity();
    const updateContent = 'update content text';
    comment.id = id;
    const spy = jest.spyOn(commentRepository, 'save');
    jest.spyOn(service, 'findById').mockReturnValue(new Promise<CommentEntity>(resolve => resolve(comment)));
    await service.update(id, { content: updateContent });
    expect(spy).toHaveBeenCalledWith({ ...comment, content: updateContent });
  });
});
