import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { supplier, supplier_contact } from '@prisma/client';
import { AddSupplierContactDTO, AddSupplierDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class SupplierService {
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
      SupplierService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findSupplierByName(name: string): Promise<supplier> {
    try {
      return await this.postgreService.supplier.findFirst({
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
            SupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            SupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }

  async getAllSuppliers(): Promise<supplier[]> {
    try {
      const supplier: supplier[] = await this.postgreService.supplier.findMany({
        where: {
          is_active: true,
        },
        include: {
          contact: {
            where: { is_active: true },
          },
          raw_material: {
            where: { is_active: true },
          },
        },
      });
      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          SupplierService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }

  async getSupplierById(supplierId: string): Promise<supplier> {
    try {
      const supplier: supplier =
        await this.postgreService.supplier.findFirstOrThrow({
          where: {
            id: supplierId,
            is_active: true,
          },
          include: {
            contact: {
              where: { is_active: true },
            },
            raw_material: {
              where: { is_active: true },
            },
          },
        });
      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            SupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }

  async addSupplier(data: {
    addSupplierDto: AddSupplierDTO;
    supplierContacts: AddSupplierContactDTO[];
  }): Promise<supplier> {
    try {
      const supplier: supplier = await this.postgreService.supplier.create({
        data: data.addSupplierDto,
      });

      await this.postgreService.supplier_contact.createMany({
        data: data.supplierContacts.map((contact: AddSupplierContactDTO) => {
          contact.supplier_id = supplier.id;
          return contact;
        }),
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.add_supplier,
        this.currUser,
        supplier.id,
      );
      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            SupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }

  async deleteSupplier(supplierId: string): Promise<supplier> {
    try {
      const supplier: supplier = await this.postgreService.supplier.update({
        where: {
          id: supplierId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.postgreService.supplier_contact.updateMany({
        where: {
          supplier_id: supplier.id,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.delete_supplier,
        this.currUser,
        supplier.id,
      );
      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            SupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }

  async updateSupplier(params: {
    where: { id: string; is_active: boolean };
    data: AddSupplierDTO;
  }): Promise<supplier> {
    try {
      const { where, data } = params;
      const supplier: supplier = await this.postgreService.supplier.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_supplier,
        this.currUser,
        supplier.id,
      );
      return supplier;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }

  async updateContactDetails(
    contacts: AddSupplierContactDTO[],
    supplierId: string,
  ): Promise<Promise<supplier_contact>[]> {
    try {
      return await contacts.map(async (contact: AddSupplierContactDTO) => {
        const id = contact.id ? contact.id : null;
        contact.id ? delete contact.id : null;
        console.log(contact);
        return await this.postgreService.supplier_contact.upsert({
          where: {
            id: id,
            supplier_id: supplierId,
            is_active: true,
          },
          update: contact,
          create: contact,
        });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            SupplierService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            SupplierService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        SupplierService.name,
      );
    }
  }
}
