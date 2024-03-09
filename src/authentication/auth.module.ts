/*
https://docs.nestjs.com/modules
*/
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import { ErrorService } from 'src/config/error/error.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    ErrorService,
    AppConfigService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
