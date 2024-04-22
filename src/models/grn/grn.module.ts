import { GrnController } from './grn.controller';
import { GrnService } from './grn.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [GrnController],
  providers: [GrnService],
})
export class GrnModule {}
