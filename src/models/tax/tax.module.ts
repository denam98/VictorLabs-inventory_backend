import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
