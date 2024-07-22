import { RequestService } from 'src/config/app/request.service';
import { ErrorService } from 'src/config/error/error.service';
import { Injectable } from '@nestjs/common';
import {
  price_change_reason,
  product,
  product_category,
  product_costing_item,
  product_price,
  product_sub_category,
} from '@prisma/client';
import {
  AddProductCategoryDTO,
  AddProductDTO,
  AddProductSubCategoryDTO,
} from 'src/common/dtos/dto';
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

  async getAllProductSubCategories(): Promise<product_sub_category[]> {
    try {
      console.log('came to getAllProductSub');
      const res = await this.postgreService.product_sub_category.findMany({
        where: {
          is_active: true,
        },
        include: {
          product_category: true,
        },
      });

      console.log('response form db', res);

      return res;
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

  async getProductSubCategoryById(
    categoryId: number,
  ): Promise<product_sub_category> {
    try {
      const productSubCategory: product_sub_category =
        await this.postgreService.product_sub_category.findFirstOrThrow({
          where: {
            id: categoryId,
            is_active: true,
          },
          include: {
            product: true,
          },
        });
      return productSubCategory;
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

  async addProductSubCategory(
    addProductSubCatDto: AddProductSubCategoryDTO,
  ): Promise<product_sub_category> {
    try {
      const productSubCategory: product_sub_category =
        await this.postgreService.product_sub_category.create({
          data: addProductSubCatDto,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_product_sub_category,
        this.currUser,
        productSubCategory.id,
      );
      return productSubCategory;
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

  async addProductCategory(
    addProductCatDto: AddProductCategoryDTO,
  ): Promise<product_category> {
    try {
      const productCategory: product_category =
        await this.postgreService.product_category.create({
          data: addProductCatDto,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_product_category,
        this.currUser,
        productCategory.id,
      );
      return productCategory;
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

  async getAllProductCostingItems(): Promise<product_costing_item[]> {
    try {
      const productCostingItems: product_costing_item[] =
        await this.postgreService.product_costing_item.findMany({
          include: {
            raw_material: true,
          },
        });
      return productCostingItems;
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

  async createProductCostingItem(costingItem: {
    rm_id: string;
    qty: number;
  }): Promise<product_costing_item> {
    try {
      const productCostingItem: product_costing_item =
        await this.postgreService.product_costing_item.create({
          data: costingItem,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_product_costing_item,
        this.currUser,
        productCostingItem.id,
      );
      return productCostingItem;
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

  async getAllProductPriceChanges(): Promise<price_change_reason[]> {
    try {
      const productPriceChangeReasons: price_change_reason[] =
        await this.postgreService.price_change_reason.findMany({
          where: {
            is_active: true,
          },
          include: {
            product_price: true,
          },
        });
      return productPriceChangeReasons;
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

  async createProductPriceChange(priceChange: {
    reason_name: string;
    is_active: boolean;
  }): Promise<price_change_reason> {
    try {
      const priceChangeReason: price_change_reason =
        await this.postgreService.price_change_reason.create({
          data: priceChange,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_product_price_change_reason,
        this.currUser,
        priceChangeReason.id,
      );
      return priceChangeReason;
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

  async getAllProductPrices(): Promise<product_price[]> {
    try {
      const productPrices: product_price[] =
        await this.postgreService.product_price.findMany({
          where: {
            is_active: true,
          },
          include: {
            product: true,
            price_change_reason: true,
          },
        });
      return productPrices;
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

  async addProductPrice(price: {
    price: number;
    reason_id: number;
    is_active: boolean;
    product_id: string;
  }): Promise<product_price> {
    try {
      const newPrice: product_price =
        await this.postgreService.product_price.create({
          data: price,
        });
      await this.commonService.recordSystemActivity(
        SystemActivity.add_product_price,
        this.currUser,
        newPrice.id,
      );
      return newPrice;
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

  async deleteCategory(id: number) {
    try {
      return this.postgreService.product_category.update({
        where: { id: Number(id) },
        data: { is_active: false },
      });
    } catch (e) {
      throw e;
    }
  }

  async deleteSubCategory(id: number) {
    try {
      return this.postgreService.product_sub_category.update({
        where: { id: Number(id) },
        data: { is_active: false },
      });
    } catch (e) {
      throw e;
    }
  }
}
