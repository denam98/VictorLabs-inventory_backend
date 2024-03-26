import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { raw_material } from '@prisma/client';
import { AddRawMaterialDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class RawMaterialService {
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
      RawMaterialService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findRawMaterialByName(name: string): Promise<raw_material> {
    try {
      return await this.postgreService.raw_material.findFirst({
        where: {
          name: name,
          is_active: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            RawMaterialService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            RawMaterialService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialService.name,
      );
    }
  }

  async getAllRawMaterials(): Promise<raw_material[]> {
    try {
      const rawMaterial: raw_material[] =
        await this.postgreService.raw_material.findMany({
          where: {
            is_active: true,
          },
        });
      return rawMaterial;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          RawMaterialService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialService.name,
      );
    }
  }

  async getRawMaterialById(materialId: string): Promise<raw_material> {
    try {
      const rawMaterial: raw_material =
        await this.postgreService.raw_material.findFirstOrThrow({
          where: {
            id: materialId,
            is_active: true,
          },
        });
      return rawMaterial;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RawMaterialService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            RawMaterialService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialService.name,
      );
    }
  }

  async addRawMaterial(
    addRawMaterailDto: AddRawMaterialDTO,
  ): Promise<raw_material> {
    try {
      const rawMaterial: raw_material =
        await this.postgreService.raw_material.create({
          data: addRawMaterailDto,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_raw_material,
        this.currUser,
        rawMaterial.id,
      );
      return rawMaterial;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            RawMaterialService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            RawMaterialService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialService.name,
      );
    }
  }

  async deleteRawMaterial(materialId: string): Promise<raw_material> {
    try {
      const rawMaterial: raw_material =
        await this.postgreService.raw_material.update({
          where: {
            id: materialId,
            is_active: true,
          },
          data: {
            is_active: false,
          },
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_raw_material,
        this.currUser,
        rawMaterial.id,
      );
      return rawMaterial;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RawMaterialService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            RawMaterialService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialService.name,
      );
    }
  }

  async updateRawMaterial(params: {
    where: { id: string; is_active: boolean };
    data: AddRawMaterialDTO;
  }): Promise<raw_material> {
    try {
      const { where, data } = params;
      const rawMaterial: raw_material =
        await this.postgreService.raw_material.update({
          where,
          data,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_raw_material,
        this.currUser,
        rawMaterial.id,
      );
      return rawMaterial;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            RawMaterialService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            RawMaterialService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        RawMaterialService.name,
      );
    }
  }
}
