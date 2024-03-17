/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { RegisterUserDTO } from 'src/common/dtos/register-user.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/register')
  createUser(@Body() registerUserDto: RegisterUserDTO) {
    return this.userService.registerUser(registerUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }
}
