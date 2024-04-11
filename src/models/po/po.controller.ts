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
import { PoService } from './po.service';
import { CreatePoDTO } from 'src/common/dtos/dto';

@Controller('api/v1/po')
export class PoController {
  constructor(private poService: PoService) {}

  @Get('all')
  async getAllPo() {
    return await this.poService.getAllPo();
  }

  @Get('/:id')
  async getPo(@Param('id') poId: string) {
    return await this.poService.getPo(poId);
  }

  @Get('')
  getPoByPoNo(@Query('poNo') poNo: string) {
    return this.poService.findPoByPoNo(poNo);
  }

  @Post('/add')
  async createPo(@Body() createPoDto: CreatePoDTO) {
    return await this.poService.createPo(createPoDto);
  }

  @Delete('/:id')
  async deletePo(@Param('id') poId: string) {
    return await this.poService.deletePo(poId);
  }

  @Put('/:id')
  async updatePo(@Param('id') poId: string, @Body() createPoDto: CreatePoDTO) {
    const params = {
      where: { id: poId, is_active: true },
      data: createPoDto,
    };
    return await this.poService.updatePo(params);
  }
}
