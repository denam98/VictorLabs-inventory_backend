import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterUserDTO } from 'src/common/dtos/register-user.dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';

@Injectable()
export class UserService {
  constructor(
    private postgreService: PostgresConfigService,
    private errorService: ErrorService,
    private commonService: AppConfigService,
  ) {}

  async findUserByUsername(username: string): Promise<User> {
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
          throw error;
        }
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.postgreService.user.findMany();
      return users.map((user: User) =>
        this.commonService.exclude(user, ['password']),
      );
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId: number) {
    try {
      const user = await this.postgreService.user.findFirstOrThrow({
        where: {
          userId: userId,
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
          throw error;
        }
      }
      throw error;
    }
  }

  async registerUser(registerUserDto: RegisterUserDTO) {
    try {
      const passwordHash: string = await this.commonService.hashPassword(
        registerUserDto.password,
      );
      const user: any = await this.postgreService.user.create({
        data: {
          email: registerUserDto.email,
          password: passwordHash,
          username: registerUserDto.username,
          roleId: registerUserDto.roleId,
          fname: registerUserDto.fname,
          lname: registerUserDto.lname,
        },
      });
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
          );
        } else {
          throw error;
        }
      }
      throw error;
    }
  }

  async deleteUser(userId: number) {
    try {
      const user: User = await this.postgreService.user.delete({
        where: {
          userId: userId,
        },
      });
      return this.commonService.exclude(user, ['password']);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error.code);
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
          );
        } else {
          throw error;
        }
      }
      throw error;
    }
  }
}
