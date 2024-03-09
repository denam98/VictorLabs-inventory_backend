import { ErrorService } from './error.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [ErrorService],
})
export class ErrorModule {}
