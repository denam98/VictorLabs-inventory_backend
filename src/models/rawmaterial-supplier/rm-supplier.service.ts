import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { rm_supplier } from '@prisma/client';
import { AddRawMaterialSupplierDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class RawMaterialSupplierService {
  currUser: string;

  constructor(
    private postgreService: PostgresConfigService,
    private errorService: ErrorService,
    private commonService: AppConfigService,
    private readonly requestService: RequestService,
  ) {
    this.currUser = this.requestService.getUserId();
    this.errorService.printLog(
      'info',
      RawMaterialSupplierService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async getAllByRawMaterialId(materialId: string): Promise<rm_supplier[]> {
    try {
      return await this.postgreService.rm_supplier.findMany({
        where: {
          rm_id: materialId,
          is_active: true,
        },
        include: {
          raw_material: true,
          supplier: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            RawMaterialSupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            RawMaterialSupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialSupplierService.name,
      );
    }
  }

  async getAllBySupplierId(supplierId: string): Promise<rm_supplier[]> {
    try {
      const rm_supplier: rm_supplier[] =
        await this.postgreService.rm_supplier.findMany({
          where: {
            supplier_id: supplierId,
            is_active: true,
          },
          include: {
            supplier: true,
            raw_material: true,
          },
        });
      return rm_supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          RawMaterialSupplierService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialSupplierService.name,
      );
    }
  }

  async getRawMaterialSupplierById(rmSupplierId: number): Promise<rm_supplier> {
    try {
      const rm_supplier: rm_supplier =
        await this.postgreService.rm_supplier.findFirstOrThrow({
          where: {
            id: rmSupplierId,
            is_active: true,
          },
          include: {
            supplier: true,
            raw_material: true,
          },
        });
      return rm_supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RawMaterialSupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            RawMaterialSupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialSupplierService.name,
      );
    }
  }

  async addRawMaterialSupplier(
    rmSupplierDto: AddRawMaterialSupplierDTO,
  ): Promise<rm_supplier> {
    try {
      const rm_supplier: rm_supplier =
        await this.postgreService.rm_supplier.create({
          data: rmSupplierDto,
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.add_supplier,
        this.currUser,
        rm_supplier.id,
      );
      return rm_supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            RawMaterialSupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            RawMaterialSupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialSupplierService.name,
      );
    }
  }

  async deleteRawMaterialSupplier(rmSupplierId: number): Promise<rm_supplier> {
    try {
      const rm_supplier: rm_supplier =
        await this.postgreService.rm_supplier.update({
          where: {
            id: rmSupplierId,
            is_active: true,
          },
          data: {
            is_active: false,
          },
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.delete_supplier,
        this.currUser,
        rm_supplier.id,
      );
      return rm_supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RawMaterialSupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            RawMaterialSupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialSupplierService.name,
      );
    }
  }
}
