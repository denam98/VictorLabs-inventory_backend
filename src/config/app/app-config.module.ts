import { AppConfigService } from './app-config.service';
/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { RequestService } from './request.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AppConfigService, RequestService],
  exports: [AppConfigService, RequestService],
})
export class AppConfigModule {}
