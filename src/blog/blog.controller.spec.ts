import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as Faker from 'faker';
import * as mocks from 'node-mocks-http';

import { BlogController } from './blog.controller';
import { BlogEntity } from './entities/blog.entity';
import { UserEntity } from '../users/entities/user.entity';
import { BlogService } from './blog.service';
import { UsersService } from '../users/users.service';
import { repositoryMockFactory } from '../mock/repository.mock';
import { blogsMockData } from '../mock/blog.mock';
import { getFromDto } from '../common/utils/repository.util';
import { SuccessResponse } from '../common/models/success-response';
import { CommentService } from '../comment/comment.service';
import { CommentEntity } from '../comment/entities/comment.entity';


describe('Blog Controller', () => {
  let controller: BlogController;
  let blogService: BlogService;
  let userService: UsersService;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        UsersService,
        CommentService,
        { provide: getRepositoryToken(BlogEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(CommentEntity), useFactory: repositoryMockFactory },
      ],
      controllers: [BlogController],
    }).compile();

    controller = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService);
    userService = module.get<UsersService>(UsersService);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('all should return all blogs as dto array', async () => {
    const blogEntities = blogsMockData.map(d => getFromDto<BlogEntity>(d, new BlogEntity()));
    jest.spyOn(blogService, 'find').mockReturnValue(new Promise<BlogEntity[]>(resolve => resolve(blogEntities)));
    const result = await controller.all();
    expect(result).toStrictEqual(blogEntities.map(blog => blog.toDto()));
  });

  it('getBlog should call BlogService findById method', async () => {
    const id = Faker.random.uuid();
    jest.spyOn(blogService, 'findById').mockReturnValue(new Promise<BlogEntity>(resolve => resolve(new BlogEntity())));
    const spy = jest.spyOn(blogService, 'findById');
    await controller.getBlog(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('addBlog should call BlogService add method with given user and blog data', async () => {
    const id = Faker.random.uuid();
    const user = new UserEntity();
    user.id = id;
    const req = mocks.createRequest();
    req.user = { id };
    jest.spyOn(userService, 'findById').mockReturnValue(new Promise(resolve => resolve(user)));
    const spy = jest.spyOn(blogService, 'add');
    await controller.addBlog(req, blogsMockData[0]);
    expect(spy).toHaveBeenCalledWith(user, blogsMockData[0]);
  });

  it('updateBlog should call BlogService update method', async () => {
    const id = Faker.random.uuid();
    const blog = blogsMockData[0];
    const spy = jest.spyOn(blogService, 'update');
    spy.mockReturnValue(new Promise<BlogEntity>(resolve => resolve(new BlogEntity())));
    await controller.updateBlog(id, blog);
    expect(spy).toHaveBeenCalledWith(id, blog);
  });

  it('delete should call BlogService delete method', async () => {
    const id = Faker.random.uuid();
    jest.spyOn(commentService, 'deleteMany').mockReturnValue(new Promise(resolve => resolve(new SuccessResponse(true))));
    const spy = jest.spyOn(blogService, 'delete');
    spy.mockReturnValue(new Promise<SuccessResponse>(resolve => resolve(new SuccessResponse(true))));
    await controller.deleteBlog(id);
    expect(spy).toHaveBeenCalled();
  });

  it('delete should remove comments as well', async () => {
    const id = Faker.random.uuid();
    const blog = new BlogEntity();
    blog.id = id;
    blog.comments = [new CommentEntity()];
    jest.spyOn(blogService, 'findById').mockReturnValue(new Promise<BlogEntity>(resolve => resolve(blog)));
    jest.spyOn(blogService, 'delete').mockReturnValue(new Promise<SuccessResponse>(resolve => resolve(new SuccessResponse(true))));
    const spy = jest.spyOn(commentService, 'deleteMany').mockReturnValue(new Promise<SuccessResponse>(resolve => resolve(new SuccessResponse())));
    await controller.deleteBlog(id);
    expect(spy).toHaveBeenCalledWith(blog.comments);
  });
});
