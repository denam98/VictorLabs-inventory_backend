import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO, UpdateUserDTO } from 'src/common/dtos/dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') userId: string) {
    return await this.userService.getUser(userId);
  }

  @Get('/')
  async getUserByUsername(@Query('uname') uname: string) {
    return await this.userService.getAllByUsername(uname);
  }

  @Post('/register')
  async createUser(@Body() registerUserDto: RegisterUserDTO) {
    return await this.userService.registerUser(registerUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    const params = {
      where: { user_id: userId, is_active: true },
      data: updateUserDto,
    };
    return await this.userService.updateUser(params);
  }
}
