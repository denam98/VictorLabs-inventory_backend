import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { tax_type } from '@prisma/client';
import { TaxTypeDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class TaxService {
  constructor(
    private postgreService: PostgresConfigService,
    private errorService: ErrorService,
    private commonService: AppConfigService,
    private readonly requestService: RequestService,
  ) {}

  async findTaxTypeByTaxTypeName(name: string): Promise<tax_type> {
    try {
      return await this.postgreService.tax_type.findFirst({
        where: {
          name: name,
          is_active: true,
        },
        include: {
          po_tax_type: true,
          srn_tax_type: true,
          grn_tax_type: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            TaxService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            TaxService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }

  async getAllByTaxTypeName(name: string): Promise<tax_type[]> {
    try {
      return await this.postgreService.tax_type.findMany({
        where: {
          name: name,
          is_active: true,
        },
        include: {
          po_tax_type: true,
          srn_tax_type: true,
          grn_tax_type: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            TaxService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            TaxService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }

  async getAllTaxTypes(): Promise<tax_type[]> {
    try {
      return await this.postgreService.tax_type.findMany({
        where: {
          is_active: true,
        },
        include: {
          po_tax_type: true,
          srn_tax_type: true,
          grn_tax_type: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          TaxService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }

  async getTaxType(Id: number): Promise<tax_type> {
    try {
      return await this.postgreService.tax_type.findFirstOrThrow({
        where: {
          id: Id,
          is_active: true,
        },
        include: {
          po_tax_type: true,
          srn_tax_type: true,
          grn_tax_type: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            TaxService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            TaxService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }

  async registerTaxType(taxTypeDto: TaxTypeDTO): Promise<tax_type> {
    try {
      const tax_type: tax_type = await this.postgreService.tax_type.create({
        data: taxTypeDto,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.create_tax_type,
        this.requestService.getUserId(),
        tax_type.id,
      );
      return tax_type;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            TaxService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            TaxService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }

  async deleteTaxType(Id: number): Promise<tax_type> {
    try {
      const tax_type: tax_type = await this.postgreService.tax_type.update({
        where: {
          id: Id,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_tax_type,
        this.requestService.getUserId(),
        tax_type.id,
      );
      return tax_type;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            TaxService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            TaxService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }

  async updateTaxType(params: { where: { id: number }; data: TaxTypeDTO }) {
    try {
      const { where, data } = params;
      const tax_type: tax_type = await this.postgreService.tax_type.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_tax_type,
        this.requestService.getUserId(),
        tax_type.id,
      );
      return tax_type;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            TaxService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            TaxService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        TaxService.name,
      );
    }
  }
}
