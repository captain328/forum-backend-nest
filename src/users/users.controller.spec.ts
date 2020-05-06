import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Faker from 'faker';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { repositoryMockFactory } from '../mock/repository.mock';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserRole } from './enums';

describe('Users Controller', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('changeRole should call updateUser method with changed role', async () => {
    const id = Faker.random.uuid();
    const changeRoleDto = new ChangeRoleDto();
    changeRoleDto.id = id;
    changeRoleDto.role = UserRole.Admin;
    const user = new UserEntity();
    jest.spyOn(userService, 'findById').mockReturnValue(new Promise<UserEntity>(resolve => resolve(user)));
    const spy = jest.spyOn(userService, 'updateUser');
    await controller.changeRole(changeRoleDto);
    expect(spy).toHaveBeenCalledWith({...user, role: changeRoleDto.role});
  });
});
