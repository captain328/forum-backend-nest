import { BeforeInsert, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from 'bcrypt';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserRole } from '../enums';
import { UserDto } from '../dtos/user.dto';

@Entity('user')
export class User extends SoftDelete {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @BeforeInsert()
  preProcess() {
    return hash(this.password, 10).then(encrypted => this.password = encrypted);
  }

  toDto(): UserDto {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    };
  }
}
