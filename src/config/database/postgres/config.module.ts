/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { PostgresConfigService } from './config.service';

@Global()
@Module({
  providers: [PostgresConfigService],
  exports: [PostgresConfigService],
})
export class PostgresConfigModule {}
