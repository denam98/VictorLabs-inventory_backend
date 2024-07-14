import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import {
  product,
  product_category,
  product_sub_category,
} from '@prisma/client';
import { AddProductDTO } from 'src/common/dtos/dto';
import { PostgresConfigService } from 'src/config/database/postgres/config.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppConfigService } from 'src/config/app/app-config.service';
import { SystemActivity } from 'src/common/util/system-activity.enum';

@Injectable()
export class ProductService {
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
      ProductService.name,
      'current user ===> ' + this.currUser,
    );
  }

  async findProductByName(name: string): Promise<product[]> {
    try {
      return await this.postgreService.product.findMany({
        where: {
          name: name,
          is_active: true,
        },
        include: {
          product_sub_category: true,
          product_price: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E001,
            error,
            ProductService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            ProductService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async getAllProducts(): Promise<product[]> {
    try {
      const products: product[] = await this.postgreService.product.findMany({
        where: {
          is_active: true,
        },
        include: {
          product_sub_category: true,
          product_price: true,
        },
      });
      return products;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          ProductService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async getAllSubCategories(): Promise<product_sub_category[]> {
    try {
      const productSubCategories: product_sub_category[] =
        await this.postgreService.product_sub_category.findMany({
          where: {
            is_active: true,
          },
          include: {
            product: true,
            product_category: true,
          },
        });
      return productSubCategories;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          ProductService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async getAllProductCategories(): Promise<product_category[]> {
    try {
      const productCategories: product_category[] =
        await this.postgreService.product_category.findMany({
          where: {
            is_active: true,
          },
          include: {
            product_sub_category: true,
          },
        });
      return productCategories;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw this.errorService.newError(
          this.errorService.ErrConfig.E0016,
          error,
          ProductService.name,
        );
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async getProductById(productId: string): Promise<product> {
    try {
      const products: product =
        await this.postgreService.product.findFirstOrThrow({
          where: {
            id: productId,
            is_active: true,
          },
          include: {
            product_sub_category: true,
            product_price: true,
          },
        });
      return products;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            ProductService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            ProductService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async getProductsByIds(idList: string[]): Promise<product[]> {
    try {
      const promiseList: Promise<product>[] = idList.map(
        async (productId: string) => {
          return await this.postgreService.product.findFirstOrThrow({
            where: {
              id: productId,
              is_active: true,
            },
            include: {
              product_sub_category: true,
              product_price: true,
            },
          });
        },
      );

      return Promise.all(promiseList).then((result: product[]) => {
        return result;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            ProductService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0016,
            error,
            ProductService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async addProduct(addProductDto: AddProductDTO): Promise<product> {
    try {
      const products: product = await this.postgreService.product.create({
        data: addProductDto,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_product,
        this.currUser,
        products.id,
      );
      return products;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E007,
            error,
            ProductService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            ProductService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async deleteProduct(productId: string): Promise<product> {
    try {
      const products: product = await this.postgreService.product.update({
        where: {
          id: productId,
          is_active: true,
        },
        data: {
          is_active: false,
        },
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.delete_product,
        this.currUser,
        products.id,
      );
      return products;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            ProductService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0018,
            error,
            ProductService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }

  async updateProduct(params: {
    where: { id: string; is_active: boolean };
    data: AddProductDTO;
  }): Promise<product> {
    try {
      const { where, data } = params;
      const products: product = await this.postgreService.product.update({
        where,
        data,
      });
      await this.commonService.recordSystemActivity(
        SystemActivity.update_product,
        this.currUser,
        products.id,
      );
      return products;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0012,
            error,
            ProductService.name,
          );
        } else {
          throw this.errorService.newError(
            this.errorService.ErrConfig.E0019,
            error,
            ProductService.name,
          );
        }
      }
      throw this.errorService.newError(
        this.errorService.ErrConfig.E0010,
        error,
        ProductService.name,
      );
    }
  }
}
