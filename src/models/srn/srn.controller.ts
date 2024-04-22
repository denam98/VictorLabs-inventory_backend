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
import { SrnService } from './srn.service';
import { CreateSrnDTO } from 'src/common/dtos/dto';

@Controller('api/v1/srn')
export class SrnController {
  constructor(private srnService: SrnService) {}

  @Get('all')
  async getAllSrn() {
    return await this.srnService.getAllSrn();
  }

  @Get('/:id')
  async getSrn(@Param('id') srnId: string) {
    return await this.srnService.getSrn(srnId);
  }

  @Get('')
  getSrnBySrnNo(@Query('srnNo') srnNo: string) {
    return this.srnService.findSrnBySrnNo(srnNo);
  }

  @Post('/add')
  async createSrn(@Body() createSrnDto: CreateSrnDTO) {
    return await this.srnService.createSrn(createSrnDto);
  }

  @Delete('/:id')
  async deleteSrn(@Param('id') srnId: string) {
    return await this.srnService.deleteSrn(srnId);
  }

  @Put('/:id')
  async updateSrn(
    @Param('id') srnId: string,
    @Body() createSrnDto: CreateSrnDTO,
  ) {
    const params = {
      where: { id: srnId, is_active: true },
      data: createSrnDto,
    };
    return await this.srnService.updateSrn(params);
  }
}
