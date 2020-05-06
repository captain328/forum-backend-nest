import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { repositoryMockFactory } from '../mock/repository.mock';
import { jwtConstants } from './constants';
import { UserRole } from '../users/enums';
import { getFromDto } from '../common/utils/repository.util';
import { addUserMockData } from '../mock/add-user.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: jwtConstants.accessTokenExpiration },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('validateUser should return user object when user is available and password is correct', async () => {
    const user = new UserEntity();
    jest.spyOn(Bcrypt, 'compare').mockReturnValue(new Promise<boolean>(resolve => resolve(true)));
    jest.spyOn(userService, 'findByEmail').mockReturnValue(new Promise<UserEntity>(resolve => resolve(user)));
    const result = await authService.validateUser('abc@123.com', 'password');
    expect(result).toEqual(user);
  });

  it('validateUser should return null when user with email is not found', async () => {
    jest.spyOn(userService, 'findByEmail').mockReturnValue(new Promise<UserEntity>(resolve => resolve(null)));
    const result = await authService.validateUser('abc@123.com', 'password');
    expect(result).toEqual(null);
  });

  it('validateUser should return null when password is incorrect', async () => {
    const user = new UserEntity();
    jest.spyOn(Bcrypt, 'compare').mockReturnValue(new Promise<boolean>(resolve => resolve(false)));
    jest.spyOn(userService, 'findByEmail').mockReturnValue(new Promise<UserEntity>(resolve => resolve(user)));
    const result = await authService.validateUser('abc@123.com', 'password');
    expect(result).toEqual(null);
  });

  it('login should call jwt sign method', async () => {
    const spy = jest.spyOn(jwtService, 'sign');
    await authService.login({ fullName: 'name', id: 'id', email: 'mail', role: UserRole.Moderator });
    expect(spy).toBeCalled();
  });

  it('registerUser should return accessToken when user is added', async () => {
    const user = getFromDto<UserEntity>(addUserMockData, new UserEntity());
    jest.spyOn(userService, 'addUser').mockReturnValue(new Promise<UserEntity>(resolve => resolve(user)));
    const result = await authService.registerUser(addUserMockData);
    expect(result.accessToken).toBeDefined();
  });

  it('profileFromUserId should return dto object', async () => {
    const user = getFromDto<UserEntity>(addUserMockData, new UserEntity());
    jest.spyOn(userService, 'findById').mockReturnValue(new Promise<UserEntity>(resolve => resolve(user)));
    const result = await authService.profileFromUserId('hello');
    expect(result).toStrictEqual(user.toDto());
  });
});
