import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { srn, srn_item } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { CreateSrnDTO, SrnItemDTO } from 'src/common/dtos/dto';

@Injectable()
export class SrnService {
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
      SrnService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async getAllSrn(): Promise<srn[]> {
    try {
      const prns: srn[] = await this.postgreService.srn.findMany({
        where: {
          is_active: true,
        },
        include: {
          grn: true,
          srn_tax_type: true,
          srn_item: true,
        },
      });
      return prns;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          SrnService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SrnService.name,
      );
    }
  }

  async getSrn(srnId: string): Promise<srn> {
    try {
      const srn: srn = await this.postgreService.srn.findFirstOrThrow({
        where: {
          id: srnId,
          is_active: true,
        },
        include: {
          grn: true,
          srn_tax_type: true,
          srn_item: true,
        },
      });
      return srn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            SrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SrnService.name,
      );
    }
  }

  async findSrnBySrnNo(srnNo: string): Promise<srn> {
    try {
      return await this.postgreService.srn.findFirst({
        where: {
          srn_no: srnNo,
          is_active: true,
        },
        include: {
          grn: true,
          srn_tax_type: true,
          srn_item: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            SrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SrnService.name,
      );
    }
  }

  async createSrn(createSrnDto: CreateSrnDTO): Promise<srn> {
    try {
      const srnItems: SrnItemDTO[] = createSrnDto.items;
      delete createSrnDto.items;

      const srn: srn = await this.postgreService.srn.create({
        data: createSrnDto,
      });

      // Insert tax related data into srn_tax_type table
      await createSrnDto.tax_type.array.forEach((element) => {
        element['srn_id'] = srn.id;
        this.postgreService.srn_tax_type.create({
          data: element,
        });
      });

      // Inserting data into srn_item table
      const srnItemCreationPromises: Promise<srn_item>[] = srnItems.map(
        (item: SrnItemDTO) => {
          item['srn_id'] = srn.id;
          return this.postgreService.srn_item.create({
            data: item,
          });
        },
      );
      await Promise.all(srnItemCreationPromises)
        .then((rslt) => {
          srn['srn_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SrnService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_srn,
        this.currUser,
        srn.id,
      );
      return srn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            SrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SrnService.name,
      );
    }
  }

  async deleteSrn(srnId: string): Promise<srn> {
    try {
      const srn: srn = await this.postgreService.srn.update({
        where: {
          id: srnId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_srn,
        this.currUser,
        srn.id,
      );
      return srn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            SrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SrnService.name,
      );
    }
  }

  async updateSrn(params: {
    where: { id: string; is_active: boolean };
    data: CreateSrnDTO;
  }): Promise<srn> {
    try {
      const { where, data } = params;
      const srnItems: SrnItemDTO[] = data.items;
      delete data.items;
      const srn: srn = await this.postgreService.srn.update({
        where,
        data,
      });

      const srnItemCreationPromises: Promise<srn_item>[] = srnItems.map(
        (item: SrnItemDTO) => {
          item['srn_id'] = srn.id;
          const itemId = item.id && item.id != '' ? item.id : null;
          return this.postgreService.srn_item.upsert({
            where: {
              id: itemId,
              is_active: true,
            },
            update: item,
            create: item,
          });
        },
      );
      await Promise.all(srnItemCreationPromises)
        .then((rslt) => {
          srn['srn_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SrnService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.update_srn,
        this.currUser,
        srn.id,
      );
      return srn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SrnService.name,
      );
    }
  }
}
