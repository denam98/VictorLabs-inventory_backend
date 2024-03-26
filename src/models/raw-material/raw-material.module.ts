import { RawMaterialController } from './raw-material.controller';
import { RawMaterialService } from './raw-material.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RawMaterialController],
  providers: [RawMaterialService],
})
export class RawMaterialModule {}
