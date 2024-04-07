import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  // Put,
} from '@nestjs/common';
import { RawMaterialSupplierService } from './rm-supplier.service';
import { AddRawMaterialSupplierDTO } from 'src/common/dtos/dto';

@Controller('api/v1/raw-material-supplier')
export class RawMaterialSupplierController {
  constructor(private rawMaterialSupplierService: RawMaterialSupplierService) {}

  @Get('supplier/:id')
  async getAllBySupplierId(@Param('id') rmSupplierId: string) {
    return await this.rawMaterialSupplierService.getAllBySupplierId(
      rmSupplierId,
    );
  }

  @Get('raw-material/:id')
  async getAllByRawMaterialId(@Param('id') rmId: string) {
    return await this.rawMaterialSupplierService.getAllByRawMaterialId(rmId);
  }

  @Get('/:id')
  async getRawMaterialSupplierById(
    @Param('id', ParseIntPipe) rmSupplierId: number,
  ) {
    return await this.rawMaterialSupplierService.getRawMaterialSupplierById(
      rmSupplierId,
    );
  }

  @Post('/add')
  async addRawMaterialSupplier(
    @Body() rmSupplierDto: AddRawMaterialSupplierDTO,
  ) {
    return await this.rawMaterialSupplierService.addRawMaterialSupplier(
      rmSupplierDto,
    );
  }

  @Delete('/:id')
  async deleteRawMaterialSupplier(
    @Param('id', ParseIntPipe) rmSupplierId: number,
  ) {
    return await this.rawMaterialSupplierService.deleteRawMaterialSupplier(
      rmSupplierId,
    );
  }
}
