import { Injectable } from '@nestjs/common';
import { PostgresConfigService } from '../../config/database/postgres/config.service';
import { store } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { AddStoreDTO } from 'src/common/dtos/dto';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class StoreService {
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
      StoreService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findStoreByName(name: string): Promise<store[]> {
    try {
      return await this.postgreService.store.findMany({
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
            StoreService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            StoreService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        StoreService.name,
      );
    }
  }

  async getAllStores(): Promise<store[]> {
    try {
      const stores: store[] = await this.postgreService.store.findMany({
        where: {
          is_active: true,
        },
      });
      return stores;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          StoreService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        StoreService.name,
      );
    }
  }

  async getStoreById(materialId: string): Promise<store> {
    try {
      const store: store = await this.postgreService.store.findFirstOrThrow({
        where: {
          id: materialId,
          is_active: true,
        },
      });
      return store;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            StoreService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            StoreService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        StoreService.name,
      );
    }
  }

  async addStore(addRawMaterailDto: AddStoreDTO): Promise<store> {
    try {
      const store: store = await this.postgreService.store.create({
        data: addRawMaterailDto,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_store,
        this.currUser,
        store.id,
      );
      return store;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            StoreService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            StoreService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        StoreService.name,
      );
    }
  }

  async deleteStore(materialId: string): Promise<store> {
    try {
      const store: store = await this.postgreService.store.update({
        where: {
          id: materialId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_store,
        this.currUser,
        store.id,
      );
      return store;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            StoreService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            StoreService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        StoreService.name,
      );
    }
  }

  async updateStore(params: {
    where: { id: string; is_active: boolean };
    data: { name: string };
  }): Promise<store> {
    try {
      const { where, data } = params;
      const store: store = await this.postgreService.store.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_store,
        this.currUser,
        store.id,
      );
      return store;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            StoreService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            StoreService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        StoreService.name,
      );
    }
  }
}
