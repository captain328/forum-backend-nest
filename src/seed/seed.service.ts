import { Injectable } from '@nestjs/common';
import * as Faker from 'faker';

import { UsersService } from '../users/users.service';
import { mailDomain, seedAdminUser, seedGeneralUser, seedModeratorUser, seedPassword } from './data/user.data';
import { UserRole } from '../users/enums';
import {
  seedBlogContentWordCount,
  seedBlogCountPerUser,
  seedBlogTitleWordCount,
  seedGeneralUserCount,
  seedModeratorCount,
} from './consts';
import { UserEntity } from '../users/entities/user.entity';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class SeedService {
  constructor(
    private userService: UsersService,
    private blogService: BlogService,
  ) {
  }

  async start() {
    await this.seedUsers();
    await this.seedBlogs();
  }

  async seedUsers() {
    console.log('Start adding seed users...');
    const userCount = await this.userService.count();
    if (userCount) {
      console.log('Skipped user seed');
      return;
    }

    // seed admin user
    console.log('Adding admin user...');
    const admin = await this.userService.addUser(seedAdminUser);
    admin.role = UserRole.Admin;
    await this.userService.updateUser(admin);

    // seed moderator users
    console.log('Adding moderator users...');
    const defaultModerator = await this.userService.addUser(seedModeratorUser);
    defaultModerator.role = UserRole.Moderator;
    await this.userService.updateUser(defaultModerator);
    for (let i = 0; i < seedModeratorCount; i++) {
      await this.addUserWithRole(UserRole.Moderator);
    }

    // seed general users
    console.log('Adding general users...');
    const defaultGeneralUser = await this.userService.addUser(seedGeneralUser);
    defaultGeneralUser.role = UserRole.User;
    await this.userService.updateUser(defaultGeneralUser);
    for (let i = 0; i < seedGeneralUserCount; i++) {
      await this.addUserWithRole(UserRole.User);
    }
    console.log('Finished adding seed users.');
  }

  async seedBlogs() {
    console.log('Start adding seed blogs...');
    const users = await this.userService.find();
    await Promise.all(users.map(async user => {
      console.log(`Adding seed blogs for user ${user.email}...`);
      for (let i = 0; i < seedBlogCountPerUser; i++) {
        const title = Faker.lorem.sentence(seedBlogTitleWordCount);
        const content = Faker.lorem.sentence(seedBlogContentWordCount);
        await this.blogService.add(user, { title, content });
      }
    }));
    console.log('Finished add seed blogs.');
  }

  private async addUserWithRole(role: UserRole): Promise<UserEntity> {
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    const user = await this.userService.addUser({
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${mailDomain}`,
      password: seedPassword,
    });
    user.role = role;
    return this.userService.updateUser(user);
  }
}
