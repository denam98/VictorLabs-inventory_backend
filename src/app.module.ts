import { RequestService } from './common/services/request.service';
import { AppConfigModule } from './config/app/app-config.module';
import { UserModule } from './models/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { ErrorModule } from './config/error/error.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    AuthModule,
    PostgresConfigModule,
    ErrorModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'dchamath5@gmail.com',
          pass: 'vano opfd nhqq xhrf',
        },
      },
    }),
  ],
  providers: [RequestService, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: 'api/v1/auth/authenticate', method: RequestMethod.POST })
      .forRoutes({ path: 'api/v1/*', method: RequestMethod.ALL });
  }
}
