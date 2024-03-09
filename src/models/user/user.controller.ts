/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
