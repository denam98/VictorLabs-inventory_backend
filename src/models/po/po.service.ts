import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { po, po_item, po_tax_type } from '@prisma/client';
import { CreatePoDTO, PoItemDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';
import lodash from 'lodash';
import CreateNewPoDto from '../../common/dtos/createNewPo.dto';
import NewPoItemDto from '../../common/dtos/new-po-item.dto';

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
      const taxTypes: number[] = createPoDto.tax_type;
      delete createPoDto.items;
      delete createPoDto.tax_type;

      const po: po = await this.postgreService.po.create({
        data: createPoDto,
      });

      // Insert tax related data into po_tax_type table

      let poTaxCreationPromises: Promise<po_tax_type>[] = [];

      if (taxTypes && taxTypes.length > 0) {
        poTaxCreationPromises = taxTypes.map((element) => {
          const obj = {
            po_id: po.id,
            tax_type_id: element,
          };

          return this.postgreService.po_tax_type.create({
            data: obj,
          });
        });
      }
      await Promise.all(poTaxCreationPromises)
        .then((rslt) => {
          po['tax_type'] = rslt;
        })
        .catch((error) => {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            PoService.name,
          );
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

      // Inserting data into po_item table
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
            this.errorService.ErrConfig.E007,
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

  async createNewPo(createNewPoDto: CreateNewPoDto) {
    try {
      const newItems: NewPoItemDto[] = createNewPoDto.items;
      console.log('newItems', newItems);
      let resTaxPromise;
      const res = await this.postgreService.po.create({
        data: {
          supplier_id: createNewPoDto.supplier_id,
          special_note: createNewPoDto.special_note,
          delivery_location: createNewPoDto.delivery_location,
          currency: 'LKR',
          discount_type: createNewPoDto.discount_type,
          discount: createNewPoDto.discount,
          deliver_before: createNewPoDto.deliver_before,
          contact_person: createNewPoDto.contact_person,
          po_no: createNewPoDto.po_no,
        },
      });

      if (!res) {
        throw new InternalServerErrorException('Cannot Create the PO');
      }

      if (newItems.length > 0) {
        const itemPromises = newItems.map((item) => {
          console.log('inside itemPromise ==> ', {
            po_id: res.id,
            rm_id: item.rm_id,
            qty: item.qty,
            price_per_unit: item.price_per_unit,
            prn_item_id: item.prn_item_id,
          });
          return new Promise(async (resolve, reject) => {
            const resCreatePoItem = await this.postgreService.po_item.create({
              data: {
                po_id: res.id,
                rm_id: item.rm_id,
                qty: item.qty,
                price_per_unit: item.price_per_unit,
                prn_item_id: item.prn_item_id,
              },
            });
            console.log('creating the items', resCreatePoItem);

            if (resCreatePoItem) {
              resolve(resCreatePoItem);
            } else {
              reject(resCreatePoItem);
            }
          });
        });

        if (createNewPoDto.tax_type?.length > 0) {
          resTaxPromise = createNewPoDto.tax_type.map(async (tax) => {
            return await new Promise(async (resolve, reject) => {
              const resTaxType = await this.postgreService.po_tax_type.create({
                data: { po_id: res.id, tax_type_id: tax },
              });
              if (resTaxType) {
                resolve(resTaxType);
              } else {
                reject(resTaxType);
              }
            });
          });
        }

        let taxRes;

        const finalRes = await Promise.all(itemPromises);
        if (createNewPoDto.tax_type?.length > 0) {
          taxRes = await Promise.all(resTaxPromise);
        }

        if (finalRes) {
          return { ...res, items: finalRes, tax_type: taxRes };
        } else {
          throw new Error('Unknown Exception');
        }
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
