import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { RegisterUserDTO } from 'src/common/dtos/dto';
import { AppConfigService } from 'src/config/app/app-config.service';
import { ErrorService } from 'src/config/error/error.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private postgreConfigService: PostgresConfigService,
    private commonService: AppConfigService,
    private errorService: ErrorService,
  ) {}

  async validateUser(username: string, password: string) {
    const user: User = await this.userService.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.commonService.exclude(user, ['password']);
    }
    return null;
  }

  login(user: User): any {
    const payload = {
      username: user.username,
      sub: {
        id: user.userId,
        email: user.email,
        role: user.roleId,
      },
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '3d' }),
    };
  }

  refreshToken(user: User): any {
    const payload = {
      username: user.username,
      sub: {
        id: user.userId,
        email: user.email,
        role: user.roleId,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDTO): Promise<User> {
    try {
      const user: User = await this.userService.registerUser(registerUserDto);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
