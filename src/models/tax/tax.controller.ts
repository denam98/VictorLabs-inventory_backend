import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxTypeDTO } from 'src/common/dtos/dto';

@Controller('api/v1/tax')
export class TaxController {
  constructor(private taxService: TaxService) {}

  @Get('all')
  async getAllTaxTypes() {
    return await this.taxService.getAllTaxTypes();
  }

  @Get('/:id')
  async getTaxType(@Param('id', ParseIntPipe) id: number) {
    return await this.taxService.getTaxType(id);
  }

  @Get('/')
  async getTaxTypeByTaxTypeName(@Query('name') name: string) {
    return await this.taxService.getAllByTaxTypeName(name);
  }

  @Post('/register')
  async createTaxType(@Body() taxTypeDto: TaxTypeDTO) {
    return await this.taxService.registerTaxType(taxTypeDto);
  }

  @Delete('/:id')
  async deleteTaxType(@Param('id', ParseIntPipe) id: number) {
    return await this.taxService.deleteTaxType(id);
  }

  @Put('/:id')
  async updateTaxType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaxTypeDto: TaxTypeDTO,
  ) {
    const params = {
      where: { id: id, is_active: true },
      data: updateTaxTypeDto,
    };
    return await this.taxService.updateTaxType(params);
  }
}
