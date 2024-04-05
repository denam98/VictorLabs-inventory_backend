import { PoController } from './po.controller';
import { PoService } from './po.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PoController],
  providers: [PoService],
})
export class PoModule {}
