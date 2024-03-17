import { ErrorService } from './error.service';
/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
