import { RegisterUserDTO, LoginDTO } from 'src/common/dtos/dto';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RefreshJwtGuard } from 'src/authentication/guards/refresh-jwt.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('authenticate')
  async authenticate(@Body() loginDto: LoginDTO) {
    return await this.authService.validateUser(loginDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDTO) {
    return await this.authService.register(registerUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }

  @Get('forget-password')
  async forgetPassword(@Query('email') email: string) {
    return await this.authService.forgetPassword(email);
  }
}
