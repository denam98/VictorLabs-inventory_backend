import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import { customer, customer_contact } from '@prisma/client';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';
import { AddCustomerContactDTO, AddCustomerDTO } from 'src/common/dtos/dto';

@Injectable()
export class CustomerService {
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
      CustomerService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findCustomerByName(name: string): Promise<customer[]> {
    try {
      return await this.postgreService.customer.findMany({
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
            CustomerService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            CustomerService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }

  async getAllCustomers(): Promise<customer[]> {
    try {
      const customer: customer[] = await this.postgreService.customer.findMany({
        where: {
          is_active: true,
        },
        include: {
          customer_contact: {
            where: { is_active: true },
          },
        },
      });
      return customer;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          CustomerService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }

  async getCustomerById(customerId: string): Promise<customer> {
    try {
      const customer: customer =
        await this.postgreService.customer.findFirstOrThrow({
          where: {
            id: customerId,
            is_active: true,
          },
          include: {
            customer_contact: {
              where: { is_active: true },
            },
          },
        });
      return customer;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            CustomerService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            CustomerService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }

  async addCustomer(data: {
    addCustomerDto: AddCustomerDTO;
    customerContacts: AddCustomerContactDTO[];
  }): Promise<customer> {
    try {
      const customer: customer = await this.postgreService.customer.create({
        data: data.addCustomerDto,
      });

      await this.postgreService.customer_contact.createMany({
        data: data.customerContacts.map(
          (customer_contact: AddCustomerContactDTO) => {
            customer_contact.customer_id = customer.id;
            return customer_contact;
          },
        ),
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.create_customer,
        this.currUser,
        customer.id,
      );
      return customer;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E006,
            error,
            CustomerService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            CustomerService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }

  async deleteCustomer(customerId: string): Promise<customer> {
    try {
      const customer: customer = await this.postgreService.customer.update({
        where: {
          id: customerId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.postgreService.customer_contact.updateMany({
        where: {
          customer_id: customer.id,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });

      await this.commonService.recordSystemActivity(
        SystemActivity.delete_customer,
        this.currUser,
        customer.id,
      );
      return customer;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            CustomerService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            CustomerService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }

  async updateCustomer(params: {
    where: { id: string; is_active: boolean };
    data: AddCustomerDTO;
  }): Promise<customer> {
    try {
      const { where, data } = params;
      const customer: customer = await this.postgreService.customer.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_customer,
        this.currUser,
        customer.id,
      );
      return customer;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            CustomerService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            CustomerService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }

  async updateContactDetails(
    customer_contacts: AddCustomerContactDTO[],
    customerId: string,
  ): Promise<customer_contact[]> {
    try {
      const updatedContacts: Promise<customer_contact>[] =
        await customer_contacts.map(
          async (customer_contact: AddCustomerContactDTO) => {
            const id = customer_contact.id ? customer_contact.id : -1;
            customer_contact.id ? delete customer_contact.id : null;
            console.log(customer_contact);
            return await this.postgreService.customer_contact.upsert({
              where: {
                id: id,
                customer_id: customerId,
                is_active: true,
              },
              update: customer_contact,
              create: customer_contact,
            });
          },
        );
      await this.commonService.recordSystemActivity(
        SystemActivity.update_customer,
        this.currUser,
        customerId,
      );
      return Promise.all(updatedContacts).then((data) => {
        return data;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            CustomerService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            CustomerService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        CustomerService.name,
      );
    }
  }
}
