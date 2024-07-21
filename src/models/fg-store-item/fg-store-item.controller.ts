import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FGStoreItemService } from './fg-store-item.service';
import { AddFGStoreItemDTO } from 'src/common/dtos/dto';

@Controller('/api/v1/fg_store_item')
export class FGStoreItemController {
  constructor(private storeService: FGStoreItemService) {}

  @Get('/all')
  async getAllFGStoreItems() {
    return await this.storeService.getAllFGStoreItems();
  }

  @Get('/:id')
  async getFGStoreItemByProductId(@Param('id') productId: string) {
    return await this.storeService.getFGStoreItemByProductId(productId);
  }

  @Get('')
  async getFGStoreItemByStoreName(@Query('name') name: string) {
    return await this.storeService.findFGStoreItemByStoreName(name);
  }

  @Post('/add')
  async addFGStoreItem(@Body() addFGStoreItemDto: AddFGStoreItemDTO) {
    return await this.storeService.addFGStoreItem(addFGStoreItemDto);
  }

  @Delete('/:id')
  async deleteFGStoreItem(@Param('id', ParseIntPipe) itemId: number) {
    return await this.storeService.deleteFGStoreItem(itemId);
  }
}
