import { RawMaterialSupplierController } from './rm-supplier.controller';
import { RawMaterialSupplierService } from './rm-supplier.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RawMaterialSupplierController],
  providers: [RawMaterialSupplierService],
})
export class RawMaterialSupplierModule {}
