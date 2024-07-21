import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { AddStoreDTO } from 'src/common/dtos/dto';

@Controller('/api/v1/store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('/all')
  async getAllStores() {
    return await this.storeService.getAllStores();
  }

  @Get('/:id')
  async getStoreById(@Param('id') storeId: string) {
    return await this.storeService.getStoreById(storeId);
  }

  @Get('')
  async getStoreByName(@Query('name') name: string) {
    return await this.storeService.findStoreByName(name);
  }

  @Post('/add')
  async addStore(@Body() addStoreDto: AddStoreDTO) {
    return await this.storeService.addStore(addStoreDto);
  }

  @Delete('/:id')
  async deleteStore(@Param('id') materialId: string) {
    return await this.storeService.deleteStore(materialId);
  }

  @Put('/:id')
  async updateStore(
    @Param('id') storeId: string,
    @Body() data: { name: string },
  ) {
    const params = {
      where: { id: storeId, is_active: true },
      data: data,
    };
    return await this.storeService.updateStore(params);
  }
}
