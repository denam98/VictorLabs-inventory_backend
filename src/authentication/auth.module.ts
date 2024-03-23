import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { UserService } from 'src/models/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';
import { RequestService } from 'src/common/services/request.service';
import { LocalAuthStrategy } from './strategies/local-strategy';

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
    JwtStrategy,
    RefreshTokenStrategy,
    RequestService,
    LocalAuthStrategy,
  ],
})
export class AuthModule {}
