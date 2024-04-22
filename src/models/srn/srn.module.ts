import { SrnController } from './srn.controller';
import { SrnService } from './srn.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SrnController],
  providers: [SrnService],
})
export class SrnModule {}
