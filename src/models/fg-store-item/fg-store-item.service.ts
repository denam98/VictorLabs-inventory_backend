import { Injectable } from '@nestjs/common';
import { PostgresConfigService } from '../../config/database/postgres/config.service';
import { fg_store_item } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { AddFGStoreItemDTO } from 'src/common/dtos/dto';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class FGStoreItemService {
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
      FGStoreItemService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findFGStoreItemByStoreName(name: string): Promise<fg_store_item[]> {
    try {
      return await this.postgreService.fg_store_item.findMany({
        where: {
          store: {
            name: name,
          },
          is_active: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            FGStoreItemService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            FGStoreItemService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        FGStoreItemService.name,
      );
    }
  }

  async getAllFGStoreItems(): Promise<fg_store_item[]> {
    try {
      const stores: fg_store_item[] =
        await this.postgreService.fg_store_item.findMany({
          where: {
            is_active: true,
          },
          include: {
            product: true,
            batch: true,
            store: true,
          },
        });
      return stores;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          FGStoreItemService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        FGStoreItemService.name,
      );
    }
  }

  async getFGStoreItemByProductId(productId: string): Promise<fg_store_item> {
    try {
      const fg_store_item: fg_store_item =
        await this.postgreService.fg_store_item.findFirstOrThrow({
          where: {
            is_active: true,
            product_id: productId,
          },
          include: {
            product: true,
            batch: true,
            store: true,
          },
        });
      return fg_store_item;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            FGStoreItemService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            FGStoreItemService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        FGStoreItemService.name,
      );
    }
  }

  async addFGStoreItem(
    addFGStoreItemDto: AddFGStoreItemDTO,
  ): Promise<fg_store_item> {
    try {
      const fg_store_item: fg_store_item =
        await this.postgreService.fg_store_item.create({
          data: addFGStoreItemDto,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_fg_store_item,
        this.currUser,
        fg_store_item.id,
      );
      return fg_store_item;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            FGStoreItemService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            FGStoreItemService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        FGStoreItemService.name,
      );
    }
  }

  async deleteFGStoreItem(itemId: number): Promise<fg_store_item> {
    try {
      const fg_store_item: fg_store_item =
        await this.postgreService.fg_store_item.update({
          where: {
            id: itemId,
            is_active: true,
          },
          data: {
            is_active: false,
          },
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_fg_store_item,
        this.currUser,
        fg_store_item.id,
      );
      return fg_store_item;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            FGStoreItemService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            FGStoreItemService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        FGStoreItemService.name,
      );
    }
  }
}
