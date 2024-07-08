import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { batch, batch_item } from '@prisma/client';
import { BatchDTO, BatchItemDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class BatchService {
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
      BatchService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findBatchByName(name: string): Promise<batch[]> {
    try {
      return await this.postgreService.batch.findMany({
        where: {
          name: name,
          is_complete: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            BatchService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            BatchService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }

  async getAllBatches(): Promise<batch[]> {
    try {
      const batch: batch[] = await this.postgreService.batch.findMany({
        include: {
          batch_item: {
            where: { is_active: true },
          },
        },
      });
      return batch;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          BatchService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }

  async getBatchById(batchId: string): Promise<batch> {
    try {
      const batch: batch = await this.postgreService.batch.findFirstOrThrow({
        where: {
          id: batchId,
          is_complete: true,
        },
        include: {
          batch_item: {
            where: {
              is_active: true,
            },
          },
        },
      });
      return batch;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            BatchService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            BatchService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }

  async addBatch(data: {
    addBatchDto: BatchDTO;
    batchItems: BatchItemDTO[];
  }): Promise<batch> {
    try {
      const batch: batch = await this.postgreService.batch.create({
        data: data.addBatchDto,
      });

      await this.postgreService.batch_item.createMany({
        data: data.batchItems.map((item: BatchItemDTO) => {
          item.batch_id = batch.id;
          return item;
        }),
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_batch,
        this.currUser,
        batch.id,
      );
      return batch;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            BatchService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            BatchService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }

  async deleteBatch(batchId: string): Promise<batch> {
    try {
      const batch: batch = await this.postgreService.batch.update({
        where: {
          id: batchId,
          is_complete: true,
        },
        data: {
          is_complete: false,
        },
      });

      await this.postgreService.batch_item.updateMany({
        where: {
          batch_id: batch.id,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.delete_batch,
        this.currUser,
        batch.id,
      );
      return batch;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            BatchService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            BatchService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }

  async updateBatch(params: {
    where: { id: string; is_active: boolean };
    data: BatchDTO;
  }): Promise<batch> {
    try {
      const { where, data } = params;
      const batch: batch = await this.postgreService.batch.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_batch,
        this.currUser,
        batch.id,
      );
      return batch;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            BatchService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            BatchService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }

  async updateBatchItems(
    items: BatchItemDTO[],
    batchId: string,
  ): Promise<batch_item[]> {
    try {
      const updatedItems: Promise<batch_item>[] = await items.map(
        async (item: BatchItemDTO) => {
          const id = item.id ? item.id : -1;
          item.id ? delete item.id : null;
          console.log(item);
          return await this.postgreService.batch_item.upsert({
            where: {
              id: id,
              batch_id: batchId,
              is_active: true,
            },
            update: item,
            create: item,
          });
        },
      );
      await this.commonService.recordSystemActivity(
        SystemActivity.update_batch_item,
        this.currUser,
        batchId,
      );
      return Promise.all(updatedItems).then((data) => {
        return data;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            BatchService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            BatchService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        BatchService.name,
      );
    }
  }
}
