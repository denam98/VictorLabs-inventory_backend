import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchDTO, BatchItemDTO } from 'src/common/dtos/dto';

@Controller('api/v1/supplier')
export class BatchController {
  constructor(private batchService: BatchService) {}

  @Get('all')
  async getAllBatches() {
    return await this.batchService.getAllBatches();
  }

  @Get('/:id')
  async getBatchById(@Param('id') batchId: string) {
    return await this.batchService.getBatchById(batchId);
  }

  @Get('/')
  async getBatchByName(@Param('name') name: string) {
    return await this.batchService.findBatchByName(name);
  }

  @Post('/add')
  async addBatch(
    @Body()
    data: {
      addBatchDto: BatchDTO;
      batchItems: BatchItemDTO[];
    },
  ) {
    return await this.batchService.addBatch(data);
  }

  @Delete('/:id')
  async deleteBatch(@Param('id') supplierId: string) {
    return await this.batchService.deleteBatch(supplierId);
  }

  @Put('/:id')
  async updateBatch(
    @Param('id') supplierId: string,
    @Body() addBatchDto: BatchDTO,
  ) {
    const params = {
      where: { id: supplierId, is_active: true },
      data: addBatchDto,
    };
    return await this.batchService.updateBatch(params);
  }

  @Put('/contacts/:id')
  async updateBatchItems(
    @Param('id') batchId: string,
    @Body() itemDTOs: BatchItemDTO[],
  ) {
    return await this.batchService.updateBatchItems(itemDTOs, batchId);
  }
}
