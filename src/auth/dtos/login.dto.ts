import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, description: 'The email address to login' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: 'The password to login' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
