import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from './enums';
import { User } from './entities/user.entity';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async addUser(dto: RegisterUserDto): Promise<User> {
    const user = getFromDto<User>(dto, new User());
    user.role = UserRole.User;
    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
