import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PrnService } from './prn.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { CreatePrnDTO } from 'src/common/dtos/dto';

@Controller('api/v1/prn')
export class PrnController {
  constructor(private prnService: PrnService) {}

  @Get('all')
  async getAllPrn() {
    return await this.prnService.getAllPrn();
  }

  @Get('priorities/all')
  async getAllPriorities() {
    return await this.prnService.getAllPriorities();
  }

  @Get('/:id')
  async getPrn(@Param('id') prnId: string) {
    return await this.prnService.getPrn(prnId);
  }

  @Get('')
  async getPrnByPrnNo(@Query('prnNo') prnNo: string) {
    return await this.prnService.findPrnByPrnNo(prnNo);
  }

  @Get('prn-items')
  async getPrnItemsByRmId(@Query('rmId') rmId: string) {
    return await this.prnService.findPrnItemsByRmId(rmId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async createPrn(@Body() createPrnDto: CreatePrnDTO) {
    return await this.prnService.createPrn(createPrnDto);
  }

  @Delete('/:id')
  async deletePrn(@Param('id') prnId: string) {
    return await this.prnService.deletePrn(prnId);
  }

  @Get('/prn-item/:prnItemId')
  async findPrnItemById(@Param('prnItemId') prnItemId: string) {
    return await this.prnService.getPrnItemById(prnItemId);
  }

  @Put('/:id')
  async updatePrn(
    @Param('id') prnId: string,
    @Body() createPrnDto: CreatePrnDTO,
  ) {
    const params = {
      where: { id: prnId, is_active: true },
      data: createPrnDto,
    };
    return await this.prnService.updatePrn(params);
  }
}
