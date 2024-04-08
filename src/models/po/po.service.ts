import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { po, po_item } from '@prisma/client';
import { CreatePoDTO, PoItemDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';
import lodash from 'lodash';

@Injectable()
export class PoService {
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
      PoService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async getAllPo(): Promise<po[]> {
    try {
      const prns: po[] = await this.postgreService.po.findMany({
        where: {
          is_active: true,
        },
        include: {
          po_item: true,
          supplier: true,
          po_tax_type: true,
          prn_item_po: true,
        },
      });
      return prns;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          PoService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PoService.name,
      );
    }
  }

  async getPo(poId: string): Promise<po> {
    try {
      const po: po = await this.postgreService.po.findFirstOrThrow({
        where: {
          id: poId,
          is_active: true,
        },
        include: {
          po_item: true,
          supplier: true,
          po_tax_type: true,
          prn_item_po: true,
        },
      });
      return po;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PoService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            PoService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PoService.name,
      );
    }
  }

  async findPoByPoNo(poNo: string): Promise<po> {
    try {
      return await this.postgreService.po.findFirst({
        where: {
          po_no: poNo,
          is_active: true,
        },
        include: {
          po_item: true,
          supplier: true,
          po_tax_type: true,
          prn_item_po: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PoService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            PoService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PoService.name,
      );
    }
  }

  async createPo(createPoDto: CreatePoDTO): Promise<po> {
    try {
      const poItems: PoItemDTO[] = createPoDto.items;
      delete createPoDto.items;

      const po: po = await this.postgreService.po.create({
        data: createPoDto,
      });

      // Inserting data into prn_item_po table and prn_item table qty
      const prnItemPoCreationPromises = poItems.map((item: PoItemDTO) => {
        // updating prn_item table qty
        this.postgreService.prn_item.update({
          where: {
            id: item.prn_item_id,
          },
          data: {
            ordered_qty: item.qty,
          },
        });

        // Inserting data into prn_item_po table
        const clonedItem = lodash.cloneDeep(item);

        clonedItem.price_per_unit ? delete clonedItem.price_per_unit : null;
        clonedItem.rm_id ? delete clonedItem.rm_id : null;

        clonedItem['po_id'] = po.id;

        return this.postgreService.prn_item_po.create({
          data: clonedItem,
        });
      });
      await Promise.all(prnItemPoCreationPromises)
        .then((rslt) => {
          console.log('created prn_item_po records ===> \n', rslt);
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PoService.name,
          );
        });

      // inserting data into po_item table
      const poItemCreationPromises: Promise<po_item>[] = poItems.map(
        (item: PoItemDTO) => {
          item['po_id'] = po.id;
          item.prn_item_id ? delete item.prn_item_id : null;
          return this.postgreService.po_item.create({
            data: item,
          });
        },
      );
      await Promise.all(poItemCreationPromises)
        .then((rslt) => {
          po['po_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PoService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_prn,
        this.currUser,
        po.id,
      );
      return po;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            PoService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PoService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PoService.name,
      );
    }
  }

  async deletePo(poId: string): Promise<po> {
    try {
      const po: po = await this.postgreService.po.update({
        where: {
          id: poId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_prn,
        this.currUser,
        po.id,
      );
      return po;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PoService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            PoService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PoService.name,
      );
    }
  }

  async updatePo(params: {
    where: { id: string; is_active: boolean };
    data: CreatePoDTO;
  }): Promise<po> {
    try {
      const { where, data } = params;
      const poItems: PoItemDTO[] = data.items;
      delete data.items;
      const po: po = await this.postgreService.po.update({
        where,
        data,
      });

      const poItemCreationPromises: Promise<po_item>[] = poItems.map(
        (item: PoItemDTO) => {
          item['po_id'] = po.id;
          const itemId = item.id && item.id != '' ? item.id : null;
          return this.postgreService.po_item.upsert({
            where: {
              id: itemId,
              is_active: true,
            },
            update: item,
            create: item,
          });
        },
      );
      await Promise.all(poItemCreationPromises)
        .then((rslt) => {
          po['po_item'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PoService.name,
          );
        });

      await this.commonService.recordSystemActivity(
        SystemActivity.update_prn,
        this.currUser,
        po.id,
      );
      return po;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            PoService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PoService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        PoService.name,
      );
    }
  }
}
