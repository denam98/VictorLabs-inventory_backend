import { AppConfigModule } from './config/app/app-config.module';
import { UserModule } from './models/user/user.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [AppConfigModule, UserModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
