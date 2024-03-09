import { RegisterUserDTO } from 'src/common/dtos/register-user-dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RefreshJwtGuard } from 'src/authentication/guards/refresh-jwt.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('authenticate')
  async authenticate(@Request() req) {
    return await this.authService.login(req.user);
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
}
