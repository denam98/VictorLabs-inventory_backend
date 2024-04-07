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
  async getAllSuppliers() {
    return await this.supplierService.getAllSuppliers();
  }

  @Get('/:id')
  async getSupplierById(@Param('id') supplierId: string) {
    return await this.supplierService.getSupplierById(supplierId);
  }

  @Get('/')
  async getSupplierByName(@Param('name') name: string) {
    return await this.supplierService.findSupplierByName(name);
  }

  @Post('/add')
  async addSupplier(
    @Body()
    data: {
      addSupplierDto: AddSupplierDTO;
      supplierContacts: AddSupplierContactDTO[];
    },
  ) {
    return await this.supplierService.addSupplier(data);
  }

  @Delete('/:id')
  async deleteSupplier(@Param('id') supplierId: string) {
    return await this.supplierService.deleteSupplier(supplierId);
  }

  @Put('/:id')
  async updateSupplier(
    @Param('id') supplierId: string,
    @Body() addSupplierDto: AddSupplierDTO,
  ) {
    const params = {
      where: { id: supplierId, is_active: true },
      data: addSupplierDto,
    };
    return await this.supplierService.updateSupplier(params);
  }

  @Put('/contacts/:id')
  async updateContacts(
    @Param('id') supplierId: string,
    @Body() contactDtos: AddSupplierContactDTO[],
  ) {
    return await this.supplierService.updateContactDetails(
      contactDtos,
      supplierId,
    );
  }
}
