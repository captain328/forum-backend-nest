import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Faker from 'faker';

import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { MockType, repositoryMockFactory } from '../mock/repository.mock';
import { addUserMockData } from '../mock/add-user.mock';
import { getFromDto } from '../common/utils/repository.util';
import { UserRole } from './enums';

describe('UsersService', () => {
  let service: UsersService;
  let userMockRepository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userMockRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail should call repository findOne with email', () => {
    const email = Faker.internet.email();
    service.findByEmail(email);
    expect(userMockRepository.findOne).toHaveBeenCalledWith({ email });
  });

  it('findById should call repository findOne with id', () => {
    const id = Faker.random.uuid();
    service.findById(id);
    expect(userMockRepository.findOne).toHaveBeenCalledWith({ id });
  });

  it('addUser should add user with "USER" role when the email is available', async () => {
    const user = getFromDto<UserEntity>(addUserMockData, new UserEntity());
    jest.spyOn(service, 'findByEmail').mockReturnValue(null);
    user.role = UserRole.User;
    const added = await service.addUser(addUserMockData);
    expect(added).toStrictEqual(user);
  });

  it('addUser should raise exception when the email is already taken', async () => {
    const user = getFromDto<UserEntity>(addUserMockData, new UserEntity());
    jest.spyOn(service, 'findByEmail').mockReturnValue(new Promise(resolve => resolve(user)));
    await expect(service.addUser(addUserMockData)).rejects.toThrowError('Email is already used.');
  });

  it('updateUser should call repository save method', () => {
    const user = new UserEntity();
    service.updateUser(user);
    expect(userMockRepository.save).toHaveBeenCalledWith(user);
  });

  it('count should call repository count method', () => {
    userMockRepository.count = jest.fn().mockImplementation(() => new Promise(resolve => resolve(0)));
    service.count();
    expect(userMockRepository.count).toHaveBeenCalledWith();
  });

  it('find should call repository find method', () => {
    service.find();
    expect(userMockRepository.find).toHaveBeenCalledWith();
  });
});
