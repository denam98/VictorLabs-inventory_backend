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
  getAllPrn() {
    return this.prnService.getAllPrn();
  }

  @Get('/:id')
  getPrn(@Param('id') prnId: string) {
    return this.prnService.getPrn(prnId);
  }

  @Get('')
  getPrnByPrnNo(@Query('prnNo') prnNo: string) {
    return this.prnService.findPrnByPrnNo(prnNo);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  createPrn(@Body() createPrnDto: CreatePrnDTO) {
    return this.prnService.createPrn(createPrnDto);
  }

  @Delete('/:id')
  deletePrn(@Param('id') prnId: string) {
    return this.prnService.deletePrn(prnId);
  }

  @Put('/:id')
  updatePrn(@Param('id') prnId: string, @Body() createPrnDto: CreatePrnDTO) {
    const params = {
      where: { id: prnId, is_active: true },
      data: createPrnDto,
    };
    return this.prnService.updatePrn(params);
  }
}
