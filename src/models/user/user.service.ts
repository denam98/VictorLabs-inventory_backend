import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { RegisterUserDTO, UpdateUserDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class UserService {
  currUser: string;

  constructor(
    private postgreService: PostgresConfigService,
    private errorService: ErrorService,
    private commonService: AppConfigService,
    private readonly requestService: RequestService,
  ) {
    this.currUser = this.requestService.getUserId();
    this.errorService.printLog(
      'info',
      UserService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findUserByUsername(username: string): Promise<user> {
    try {
      return await this.postgreService.user.findFirst({
        where: {
          username: username,
          is_active: true,
        },
        include: {
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            UserService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            UserService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        UserService.name,
      );
    }
  }

  async getAllUsers(): Promise<user[]> {
    try {
      const users: user[] = await this.postgreService.user.findMany({
        where: {
          is_active: true,
        },
        include: {
          role: true,
        },
      });
      return users.map((user: user) =>
        this.commonService.exclude(user, ['password']),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          UserService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        UserService.name,
      );
    }
  }

  async getUser(userId: string): Promise<user> {
    try {
      const user: user = await this.postgreService.user.findFirstOrThrow({
        where: {
          user_id: userId,
          is_active: true,
        },
        include: {
          role: true,
        },
      });
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            UserService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            UserService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        UserService.name,
      );
    }
  }

  async registerUser(registerUserDto: RegisterUserDTO): Promise<user> {
    try {
      const passwordHash: string = await this.commonService.hashPassword(
        registerUserDto.password,
      );
      const user: user = await this.postgreService.user.create({
        data: {
          email: registerUserDto.email,
          password: passwordHash,
          username: registerUserDto.username,
          role_id: registerUserDto.role_id,
          fname: registerUserDto.fname,
          lname: registerUserDto.lname,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.register_user,
        this.requestService.getUserId(),
        user.user_id,
      );
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            UserService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            UserService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        UserService.name,
      );
    }
  }

  async deleteUser(userId: string): Promise<user> {
    try {
      const user: user = await this.postgreService.user.update({
        where: {
          user_id: userId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_user,
        this.requestService.getUserId(),
        user.user_id,
      );
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            UserService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            UserService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        UserService.name,
      );
    }
  }

  async updateUser(params: {
    where: { user_id: string };
    data: UpdateUserDTO;
  }) {
    try {
      const { where, data } = params;
      const user: user = await this.postgreService.user.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_user,
        this.currUser,
        user.user_id,
      );
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            UserService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            UserService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        UserService.name,
      );
    }
  }
}
