import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from './enums';
import { UserEntity } from './entities/user.entity';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email: email });
  }

  async findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
  }

  async addUser(dto: RegisterUserDto): Promise<UserEntity> {
    const user = getFromDto<UserEntity>(dto, new UserEntity());
    user.role = UserRole.User;
    return this.userRepository.save(user);
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
