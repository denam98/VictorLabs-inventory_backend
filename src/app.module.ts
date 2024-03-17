import { AppConfigModule } from './config/app/app-config.module';
import { UserModule } from './models/user/user.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { ErrorModule } from './config/error/error.module';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    AuthModule,
    PostgresConfigModule,
    ErrorModule,
  ],
  providers: [AppService],
})
export class AppModule {}
