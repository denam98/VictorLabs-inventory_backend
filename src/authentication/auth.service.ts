import { Injectable } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { RegisterUserDTO } from 'src/common/dtos/dto';
import { AppConfigService } from 'src/config/app/app-config.service';
import { ErrorService } from 'src/config/error/error.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';
import { RequestService } from 'src/common/services/request.service';
import { LoginDTO } from 'src/common/dtos/login.dto';

@Injectable()
export class AuthService {
  private userId: number;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private postgreConfigService: PostgresConfigService,
    private commonService: AppConfigService,
    private errorService: ErrorService,
    private requestService: RequestService,
  ) {}

  async validateUser(loginDto: LoginDTO): Promise<any> {
    try {
      const user: user = await this.userService.findUserByUsername(
        loginDto.username,
      );
      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        return this.login(this.commonService.exclude(user, ['password']));
      }
    } catch (error) {
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
      );
    }
  }

  login(user: user): any {
    const payload = {
      username: user.username,
      sub: {
        id: user.user_id,
        email: user.email,
        role: user.role_id,
      },
    };
    this.commonService.recordSystemActivity(
      SystemActivity.user_login,
      user.user_id,
    );

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '3d' }),
    };
  }

  refreshToken(user: user): any {
    const payload = {
      username: user.username,
      sub: {
        id: user.user_id,
        email: user.email,
        role: user.role_id,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDTO): Promise<user> {
    try {
      const user: user = await this.userService.registerUser(registerUserDto);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(email: string): Promise<void> {
    try {
      const from: string = 'dchamath5@mailinator.com';
      const subject: string = 'Reset Password';
      const parsePhrase = Math.floor(100000 + Math.random() * 900000);
      const text: string =
        'Use this code to reset your password,: ' + parsePhrase;
      const html: string = `<h1 style="color: red">Surtex Inventory</h1><p>Use this code to reset your password.</p><h4>${parsePhrase}</h4>`;
      this.commonService.sendMail(from, email, text, subject, html);
    } catch (error) {
      throw error;
    }
  }
}
