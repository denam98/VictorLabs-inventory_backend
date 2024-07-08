import { Module } from '@nestjs/common';
import { UomController } from './uom.controller';
import { UomService } from './uom.service';

@Module({
  imports: [],
  controllers: [UomController],
  providers: [UomService],
})
export class UomModule {}
