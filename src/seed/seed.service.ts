import { Injectable } from '@nestjs/common';
import * as Faker from 'faker';

import { UsersService } from '../users/users.service';
import { mailDomain, seedAdminUser, seedGeneralUser, seedModeratorUser, seedPassword } from './data/user.data';
import { UserRole } from '../users/enums';
import { seedGeneralUserCount, seedModeratorCount } from './consts';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private userService: UsersService,
  ) {
  }

  async start() {
    await this.seedUsers();
    await this.seedBlogs();
  }

  async seedUsers() {
    const userCount = await this.userService.count();
    if (!userCount) {
      return;
    }

    // seed admin user
    const admin = await this.userService.addUser(seedAdminUser);
    admin.role = UserRole.Admin;
    await this.userService.updateUser(admin);

    // seed moderator users
    const defaultModerator = await this.userService.addUser(seedModeratorUser);
    defaultModerator.role = UserRole.Moderator;
    await this.userService.updateUser(defaultModerator);
    for (let i = 0; i < seedModeratorCount; i ++) {
      await this.addUserWithRole(UserRole.Moderator);
    }

    // seed general users
    const defaultGeneralUser = await this.userService.addUser(seedGeneralUser);
    defaultGeneralUser.role = UserRole.User;
    await this.userService.updateUser(defaultGeneralUser);
    for (let i = 0; i < seedGeneralUserCount; i ++) {
      await this.addUserWithRole(UserRole.User);
    }
  }

  private async addUserWithRole(role: UserRole): Promise<User> {
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    const user = await this.userService.addUser({ fullName: `${firstName} ${lastName}`, email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${mailDomain}`, password: seedPassword });
    user.role = role;
    return this.userService.updateUser(user);
  }

  async seedBlogs() {
    // TODO: add seed users
  }
}
