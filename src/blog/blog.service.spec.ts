import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Faker from 'faker';
import { Repository } from 'typeorm';

import { BlogService } from './blog.service';
import { MockType, repositoryMockFactory } from '../mock/repository.mock';
import { BlogEntity } from './entities/blog.entity';
import { UserEntity } from '../users/entities/user.entity';
import { addBlogMockData } from '../mock/add-blog.mock';
import { getFromDto } from '../common/utils/repository.util';

describe('BlogService', () => {
  let service: BlogService;
  let blogMockRepository: MockType<Repository<BlogEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: getRepositoryToken(BlogEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    blogMockRepository = module.get(getRepositoryToken(BlogEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById should call repository findOne with id and relation items', () => {
    const id = Faker.random.uuid();
    service.findById(id);
    expect(blogMockRepository.findOne).toHaveBeenCalledWith({ relations: ['comments'], where: { id } });
  });

  it('find should call repository find', () => {
    service.find();
    expect(blogMockRepository.find).toHaveBeenCalledWith();
  });

  it('add should call repository save method with author property field', async () => {
    const user = new UserEntity();
    await service.add(user, addBlogMockData);
    const blog = getFromDto<BlogEntity>(addBlogMockData, new BlogEntity());
    expect(blogMockRepository.save).toHaveBeenCalledWith({ ...blog, author: user });
  });

  it('update should call repository save method with provided content and title when the blog exists', async () => {
    const id = Faker.random.uuid();
    const existingBlog = new BlogEntity();
    existingBlog.id = id;
    jest.spyOn(service, 'findById').mockReturnValue(new Promise<BlogEntity>(resolve => resolve(existingBlog)));
    await service.update(id, addBlogMockData);
    expect(blogMockRepository.save).toHaveBeenCalledWith({ ...existingBlog, ...addBlogMockData });
  });

  it('update should raise exception when the blog does not exists', async () => {
    const id = Faker.random.uuid();
    jest.spyOn(service, 'findById').mockReturnValue(new Promise<BlogEntity>(resolve => resolve(null)));
    await expect(service.update(id, addBlogMockData)).rejects.toThrowError('Unable to find the requested blog');
  });

  it('count should call repository count method', async () => {
    blogMockRepository.count = jest.fn().mockImplementation(() => new Promise(resolve => resolve(0)));
    await service.count();
    expect(blogMockRepository.count).toHaveBeenCalledWith();
  });

  it('delete should return success response when the blog exists', async () => {
    const blog = new BlogEntity();
    blogMockRepository.softRemove = jest.fn().mockImplementation(() => new Promise(resolve => resolve(blog)));
    const result = await service.delete(blog);
    expect(result).toEqual({ success: true });
  });
});
