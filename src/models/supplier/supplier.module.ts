import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
