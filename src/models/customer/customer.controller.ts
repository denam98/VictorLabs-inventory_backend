import { AddCustomerDTO, AddCustomerContactDTO } from 'src/common/dtos/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('all')
  async getAllCustomers() {
    return await this.customerService.getAllCustomers();
  }

  @Get('/:id')
  async getCustomerById(@Param('id') CustomerId: string) {
    return await this.customerService.getCustomerById(CustomerId);
  }

  @Get('/')
  async getCustomerByName(@Param('name') name: string) {
    return await this.customerService.findCustomerByName(name);
  }

  @Post('/add')
  async addCustomer(
    @Body()
    data: {
      addCustomerDto: AddCustomerDTO;
      customerContacts: AddCustomerContactDTO[];
    },
  ) {
    return await this.customerService.addCustomer(data);
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') CustomerId: string) {
    return await this.customerService.deleteCustomer(CustomerId);
  }

  @Put('/:id')
  async updateCustomer(
    @Param('id') CustomerId: string,
    @Body() addCustomerDto: AddCustomerDTO,
  ) {
    const params = {
      where: { id: CustomerId, is_active: true },
      data: addCustomerDto,
    };
    return await this.customerService.updateCustomer(params);
  }

  @Put('/contacts/:id')
  async updateContacts(
    @Param('id') CustomerId: string,
    @Body() contactDtos: AddCustomerContactDTO[],
  ) {
    return await this.customerService.updateContactDetails(
      contactDtos,
      CustomerId,
    );
  }
}
