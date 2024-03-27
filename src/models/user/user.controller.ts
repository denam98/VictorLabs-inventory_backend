import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO, UpdateUserDTO } from 'src/common/dtos/dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  getUser(@Param('id') userId: string) {
    return this.userService.getUser(userId);
  }

  @Post('/register')
  createUser(@Body() registerUserDto: RegisterUserDTO) {
    return this.userService.registerUser(registerUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Put('/:id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    const params = {
      where: { user_id: userId, is_active: true },
      data: updateUserDto,
    };
    return this.userService.updateUser(params);
  }
}
