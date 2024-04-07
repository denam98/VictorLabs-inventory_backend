import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PoService } from './po.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { CreatePoDTO } from 'src/common/dtos/dto';

@Controller('api/v1/po')
export class PoController {
  constructor(private poService: PoService) {}

  @Get('all')
  getAllPrn() {
    return this.poService.getAllPrn();
  }

  @Get('/:id')
  getPrn(@Param('id') prnId: string) {
    return this.poService.getPrn(prnId);
  }

  // @Get('')
  // getPrnByPrnNo(@Query('prnNo') prnNo: string) {
  //   return this.poService.findPrnByPrnNo(prnNo);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  createPrn(@Body() createPoDto: CreatePoDTO) {
    return this.poService.createPrn(createPoDto);
  }

  @Delete('/:id')
  deletePrn(@Param('id') prnId: string) {
    return this.poService.deletePrn(prnId);
  }

  @Put('/:id')
  updatePrn(@Param('id') prnId: string, @Body() createPoDto: CreatePoDTO) {
    const params = {
      where: { id: prnId, is_active: true },
      data: createPoDto,
    };
    return this.poService.updatePrn(params);
  }
}
