import { Controller, Get } from '@nestjs/common';
import { UomService } from './uom.service';

@Controller('/api/v1/uom')
export class UomController {
  constructor(private uomService: UomService) {}

  @Get('/all')
  async getAllUoms() {
    try {
      return await this.uomService.getAllUom();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
