import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Faker from 'faker';

import { CommentController } from './comment.controller';
import { UsersService } from '../users/users.service';
import { CommentService } from './comment.service';
import { BlogService } from '../blog/blog.service';
import { CommentEntity } from './entities/comment.entity';
import { repositoryMockFactory } from '../mock/repository.mock';
import { UserEntity } from '../users/entities/user.entity';
import { BlogEntity } from '../blog/entities/blog.entity';
import { SuccessResponse } from '../common/models/success-response';

describe('Comment Controller', () => {
  let controller: CommentController;
  let commentService: CommentService;
  let userService: UsersService;
  let blogService: BlogService;

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
    commentService = module.get<CommentService>(CommentService);
    userService = module.get<UsersService>(UsersService);
    blogService = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('comments should return comments as dto array', async () => {
    const comments = [new CommentEntity()];
    const id = Faker.random.uuid();
    jest.spyOn(commentService, 'findByBlogId').mockReturnValue(new Promise(resolve => resolve(comments)));
    const result = await controller.comments(id);
    expect(result).toStrictEqual(comments.map(comment => comment.toDto()));
  });

  it('addComment should and a comment and return it as dto', async () => {
    const comment = new CommentEntity();
    const id = Faker.random.uuid();
    const user = new UserEntity();
    const blog = new BlogEntity();
    jest.spyOn(userService, 'findById').mockReturnValue(new Promise<UserEntity>(resolve => resolve(user)));
    jest.spyOn(blogService, 'findById').mockReturnValue(new Promise<BlogEntity>(resolve => resolve(blog)));
    jest.spyOn(commentService, 'add').mockReturnValue(new Promise<CommentEntity>(resolve => resolve(comment)));
    const result = await controller.addComment({ user: { id } }, id, { content: '' });
    expect(result).toStrictEqual(comment.toDto());
  });

  it('updateComment should call commentService update method', async () => {
    const comment = new CommentEntity();
    const spy = jest.spyOn(commentService, 'update').mockReturnValue(new Promise<CommentEntity>(resolve => resolve(comment)));
    await controller.updateComment(Faker.random.uuid(), { content: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('deleteComment should raise exception when it does not exist', async () => {
    jest.spyOn(commentService, 'findById').mockReturnValue(new Promise<CommentEntity>(resolve => resolve(null)));
    await expect(controller.deleteComment(Faker.random.uuid())).rejects.toThrowError('The comment does not exist.');
  });

  it('deleteComment should call commentService delete method', async () => {
    const comment = new CommentEntity();
    jest.spyOn(commentService, 'findById').mockReturnValue(new Promise<CommentEntity>(resolve => resolve(comment)));
    const spy = jest.spyOn(commentService, 'delete').mockReturnValue(new Promise<SuccessResponse>(resolve => resolve(new SuccessResponse())));
    await controller.deleteComment(Faker.random.uuid());
    expect(spy).toHaveBeenCalledWith(comment);
  });
});
