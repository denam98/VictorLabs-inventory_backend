/* eslint-disable @typescript-eslint/no-unused-vars */
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/common/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from 'src/common/dtos/register-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = {
      username: user.username,
      sub: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '3d' }),
    };
  }

  refreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  register(registerUserDto: RegisterUserDTO) {
    return registerUserDto;
  }
}
