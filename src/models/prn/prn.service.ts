import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { priority, prn, prn_item } from '@prisma/client';
import { CreatePrnDTO, PrnItemDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class PrnService {
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
      PrnService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findPrnByPrnNo(prnNo: string): Promise<prn> {
    try {
      return await this.postgreService.prn.findFirst({
        where: {
          prn_no: prnNo,
          is_active: true,
        },
        include: {
          prn_item: true,
          priority: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            PrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async getAllPrn(): Promise<prn[]> {
    try {
      const prns: prn[] = await this.postgreService.prn.findMany({
        where: {
          is_active: true,
        },
        include: {
          prn_item: true,
          priority: true,
        },
      });
      return prns;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          PrnService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async findPrnItemsByRmId(rmId: string): Promise<prn_item[]> {
    try {
      const prnItems: prn_item[] = await this.postgreService.prn_item.findMany({
        where: {
          rm_id: rmId,
          is_active: true,
        },
        include: {
          prn: true,
          rm: true,
        },
      });
      return prnItems;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          PrnService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async getAllPriorities(): Promise<priority[]> {
    try {
      const priorities: priority[] =
        await this.postgreService.priority.findMany({
          include: {
            prn: {
              where: { is_active: true },
            },
          },
        });
      return priorities;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          PrnService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async getPrn(prnId: string): Promise<prn> {
    try {
      const prn: prn = await this.postgreService.prn.findFirstOrThrow({
        where: {
          id: prnId,
          is_active: true,
        },
        include: {
          prn_item: true,
          priority: true,
        },
      });
      return prn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            PrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async createPrn(createPrnDto: CreatePrnDTO): Promise<prn> {
    try {
      const prnItems: PrnItemDTO[] = createPrnDto.items;
      delete createPrnDto.items;
      const prn: prn = await this.postgreService.prn.create({
        data: createPrnDto,
      });

      const prnItemCreationPromises: Promise<prn_item>[] = prnItems.map(
        (item: PrnItemDTO) => {
          item['prn_id'] = prn.id;
          return this.postgreService.prn_item.create({
            data: item,
          });
        },
      );
      await Promise.all(prnItemCreationPromises)
        .then((rslt) => {
          prn['prn_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PrnService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_prn,
        this.currUser,
        prn.id,
      );
      return prn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            PrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async deletePrn(prnId: string): Promise<prn> {
    try {
      const prn: prn = await this.postgreService.prn.update({
        where: {
          id: prnId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_prn,
        this.currUser,
        prn.id,
      );
      return prn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            PrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async updatePrn(params: {
    where: { id: string; is_active: boolean };
    data: CreatePrnDTO;
  }): Promise<prn> {
    try {
      const { where, data } = params;
      const prnItems: PrnItemDTO[] = data.items;
      delete data.items;
      const prn: prn = await this.postgreService.prn.update({
        where,
        data,
      });

      const prnItemCreationPromises: Promise<prn_item>[] = prnItems.map(
        (item: PrnItemDTO) => {
          item['prn_id'] = prn.id;
          const itemId = item.id && item.id != '' ? item.id : null;
          return this.postgreService.prn_item.upsert({
            where: {
              id: itemId,
              is_active: true,
            },
            update: item,
            create: item,
          });
        },
      );
      await Promise.all(prnItemCreationPromises)
        .then((rslt) => {
          prn['prn_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PrnService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.update_prn,
        this.currUser,
        prn.id,
      );
      return prn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PrnService.name,
      );
    }
  }

  async getPrnItemById(prnItemId: string) {
    return this.postgreService.prn_item.findFirst({
      where: {
        id: prnItemId,
      },
    });
  }
}
