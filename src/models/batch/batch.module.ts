import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
