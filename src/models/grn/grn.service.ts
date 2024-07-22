import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { grn, grn_item, grn_tax_type } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { CreateGrnDTO, GrnItemDTO } from 'src/common/dtos/dto';

@Injectable()
export class GrnService {
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
      GrnService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async getAllGrn(): Promise<grn[]> {
    try {
      const prns: grn[] = await this.postgreService.grn.findMany({
        where: {
          is_active: true,
        },
        include: {
          grn_item: true,
          srn: true,
          grn_tax_type: true,
        },
      });
      return prns;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          GrnService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        GrnService.name,
      );
    }
  }

  async getGrn(grnId: string): Promise<grn> {
    try {
      const grn: grn = await this.postgreService.grn.findFirstOrThrow({
        where: {
          id: grnId,
          is_active: true,
        },
        include: {
          grn_item: true,
          srn: true,
          grn_tax_type: true,
        },
      });
      return grn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            GrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            GrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        GrnService.name,
      );
    }
  }

  async findGrnByGrnNo(grnNo: string): Promise<grn> {
    try {
      return await this.postgreService.grn.findFirst({
        where: {
          grn_no: grnNo,
          is_active: true,
        },
        include: {
          grn_item: true,
          srn: true,
          grn_tax_type: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            GrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            GrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        GrnService.name,
      );
    }
  }

  async createGrn(createGrnDto: CreateGrnDTO): Promise<grn> {
    try {
      const grnItems: GrnItemDTO[] = createGrnDto.items;
      const taxTypes: number[] = createGrnDto.tax_type;
      delete createGrnDto.items;
      delete createGrnDto.tax_type;

      const grn: grn = await this.postgreService.grn.create({
        data: createGrnDto,
      });

      // Insert tax related data into grn_tax_type table
      const grnTaxCreationPromises: Promise<grn_tax_type>[] = taxTypes.map(
        (element) => {
          const obj = {
            grn_id: grn.id,
            tax_type_id: element,
          };

          return this.postgreService.grn_tax_type.create({
            data: obj,
          });
        },
      );
      await Promise.all(grnTaxCreationPromises)
        .then((rslt) => {
          grn['tax_type'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            GrnService.name,
          );
        });

      // Inserting data into grn_item table
      const grnItemCreationPromises: Promise<grn_item>[] = grnItems.map(
        (item: GrnItemDTO) => {
          item['grn_id'] = grn.id;
          return this.postgreService.grn_item.create({
            data: item,
          });
        },
      );
      await Promise.all(grnItemCreationPromises)
        .then((rslt) => {
          grn['grn_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            GrnService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_grn,
        this.currUser,
        grn.id,
      );
      return grn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            GrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            GrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        GrnService.name,
      );
    }
  }

  async deleteGrn(grnId: string): Promise<grn> {
    try {
      const grn: grn = await this.postgreService.grn.update({
        where: {
          id: grnId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_grn,
        this.currUser,
        grn.id,
      );
      return grn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            GrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            GrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        GrnService.name,
      );
    }
  }

  async updateGrn(params: {
    where: { id: string; is_active: boolean };
    data: CreateGrnDTO;
  }): Promise<grn> {
    try {
      const { where, data } = params;
      const grnItems: GrnItemDTO[] = data.items;
      delete data.items;
      const grn: grn = await this.postgreService.grn.update({
        where,
        data,
      });

      const grnItemCreationPromises: Promise<grn_item>[] = grnItems.map(
        (item: GrnItemDTO) => {
          item['grn_id'] = grn.id;
          const itemId = item.id && item.id != '' ? item.id : null;
          return this.postgreService.grn_item.upsert({
            where: {
              id: itemId,
              is_active: true,
            },
            update: item,
            create: item,
          });
        },
      );
      await Promise.all(grnItemCreationPromises)
        .then((rslt) => {
          grn['grn_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            GrnService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.update_grn,
        this.currUser,
        grn.id,
      );
      return grn;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            GrnService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            GrnService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        GrnService.name,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  async getNextId() {
    console.log('came here');
    try {
      let maxId: string;
      const res = await this.postgreService.grn.aggregate({
        _max: {
          grn_no: true,
        },
      });

      let max = Number(res._max.grn_no);
      max++;

      if (max < 10) {
        maxId = `0000${max}`;
      } else if (max < 100) {
        maxId = `000${max}`;
      } else if (max < 1000) {
        maxId = `00${max}`;
      } else if (max < 10000) {
        maxId = `0${max}`;
      } else {
        maxId = `${max}`;
      }
      return Promise.resolve({ newId: maxId });
    } catch (e) {
      throw e;
    }
  }
}
