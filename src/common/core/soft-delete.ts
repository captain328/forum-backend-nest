import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { CommonDto } from '../dtos/common.dto';

export class SoftDelete {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: string;

  toDto(): CommonDto {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
