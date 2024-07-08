import { Injectable } from '@nestjs/common';
import { PostgresConfigService } from '../../config/database/postgres/config.service';

@Injectable()
export class UomService {
  constructor(private postgreService: PostgresConfigService) {}

  async getAllUom() {
    try {
      return await this.postgreService.uom.findMany({ where: { is_active: true } });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
