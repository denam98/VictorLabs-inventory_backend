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
  constructor(
    private postgreService: PostgresConfigService,
    private errorService: ErrorService,
    private commonService: AppConfigService,
  ) {}

  async findUserByUsername(username: string): Promise<user> {
    try {
      return await this.postgreService.user.findFirst({
        where: {
          username: username,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
      );
    }
  }

  async getAllUsers(): Promise<user[]> {
    try {
      const users: user[] = await this.postgreService.user.findMany();
      return users.map((user: user) =>
        this.commonService.exclude(user, ['password']),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
      );
    }
  }

  async getUser(userId: string): Promise<user> {
    try {
      const user: user = await this.postgreService.user.findFirstOrThrow({
        where: {
          user_id: userId,
        },
      });
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
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
        user.user_id,
      );
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
      );
    }
  }

  async deleteUser(userId: string): Promise<user> {
    try {
      const user: user = await this.postgreService.user.delete({
        where: {
          user_id: userId,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_user,
        user.user_id,
      );
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
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
        user.user_id,
      );
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
      );
    }
  }
}
