import { PrnController } from './prn.controller';
import { PrnService } from './prn.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PrnController],
  providers: [PrnService],
})
export class PrnModule {}
