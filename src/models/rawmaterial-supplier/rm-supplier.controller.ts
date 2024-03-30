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
  getAllBySupplierId(@Param('id') rmSupplierId: string) {
    return this.rawMaterialSupplierService.getAllBySupplierId(rmSupplierId);
  }

  @Get('raw-material/:id')
  getAllByRawMaterialId(@Param('id') rmId: string) {
    return this.rawMaterialSupplierService.getAllByRawMaterialId(rmId);
  }

  @Get('/:id')
  getRawMaterialSupplierById(@Param('id', ParseIntPipe) rmSupplierId: number) {
    return this.rawMaterialSupplierService.getRawMaterialSupplierById(
      rmSupplierId,
    );
  }

  @Post('/add')
  addRawMaterialSupplier(@Body() rmSupplierDto: AddRawMaterialSupplierDTO) {
    return this.rawMaterialSupplierService.addRawMaterialSupplier(
      rmSupplierDto,
    );
  }

  @Delete('/:id')
  deleteRawMaterialSupplier(@Param('id', ParseIntPipe) rmSupplierId: number) {
    return this.rawMaterialSupplierService.deleteRawMaterialSupplier(
      rmSupplierId,
    );
  }
}
