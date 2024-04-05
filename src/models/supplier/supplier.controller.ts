import { AddSupplierContactDTO } from './../../common/dtos/add-supplier-contact.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { AddSupplierDTO } from 'src/common/dtos/dto';

@Controller('api/v1/supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get('all')
  getAllSuppliers() {
    return this.supplierService.getAllSuppliers();
  }

  @Get('/:id')
  getSupplierById(@Param('id') supplierId: string) {
    return this.supplierService.getSupplierById(supplierId);
  }

  @Get('/')
  getSupplierByName(@Param('name') name: string) {
    return this.supplierService.findSupplierByName(name);
  }

  @Post('/add')
  addSupplier(
    @Body()
    data: {
      addSupplierDto: AddSupplierDTO;
      supplierContacts: AddSupplierContactDTO[];
    },
  ) {
    return this.supplierService.addSupplier(data);
  }

  @Delete('/:id')
  deleteSupplier(@Param('id') supplierId: string) {
    return this.supplierService.deleteSupplier(supplierId);
  }

  @Put('/:id')
  updateSupplier(
    @Param('id') supplierId: string,
    @Body() addSupplierDto: AddSupplierDTO,
  ) {
    const params = {
      where: { id: supplierId, is_active: true },
      data: addSupplierDto,
    };
    return this.supplierService.updateSupplier(params);
  }

  @Put('/contacts/:id')
  updateContacts(
    @Param('id') supplierId: string,
    @Body() contactDtos: AddSupplierContactDTO[],
  ) {
    return this.supplierService.updateContactDetails(contactDtos, supplierId);
  }
}
