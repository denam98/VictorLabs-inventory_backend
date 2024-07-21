import { Module } from '@nestjs/common';
import { FGStoreItemController } from './fg-store-item.controller';
import { FGStoreItemService } from './fg-store-item.service';

@Module({
  imports: [],
  controllers: [FGStoreItemController],
  providers: [FGStoreItemService],
})
export class FGStoreItemModule {}
