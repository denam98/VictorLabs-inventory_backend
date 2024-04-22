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
import { GrnService } from './grn.service';
import { CreateGrnDTO } from 'src/common/dtos/dto';

@Controller('api/v1/grn')
export class GrnController {
  constructor(private grnService: GrnService) {}

  @Get('all')
  async getAllGrn() {
    return await this.grnService.getAllGrn();
  }

  @Get('/:id')
  async getGrn(@Param('id') grnId: string) {
    return await this.grnService.getGrn(grnId);
  }

  @Get('')
  getGrnByGrnNo(@Query('grnNo') grnNo: string) {
    return this.grnService.findGrnByGrnNo(grnNo);
  }

  @Post('/add')
  async createGrn(@Body() createGrnDto: CreateGrnDTO) {
    return await this.grnService.createGrn(createGrnDto);
  }

  @Delete('/:id')
  async deleteGrn(@Param('id') grnId: string) {
    return await this.grnService.deleteGrn(grnId);
  }

  @Put('/:id')
  async updateGrn(
    @Param('id') grnId: string,
    @Body() createGrnDto: CreateGrnDTO,
  ) {
    const params = {
      where: { id: grnId, is_active: true },
      data: createGrnDto,
    };
    return await this.grnService.updateGrn(params);
  }
}
