import { PostgresConfigService } from '../../config/database/postgres/config.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private postgreService: PostgresConfigService) {}

  async getAllProductCategories() {
    try {
      return await this.postgreService.product_category.findMany({
        where: { is_active: true },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getAllProductSubCategories(category_id: number) {
    try {
      return await this.postgreService.product_sub_category.findMany({
        where: { is_active: true, category_id: Number(category_id) },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createNewProduct(product: any, productItems: any[]) {
    try {
      console.log('productItems', productItems);

      if (productItems.length === 0) {
        throw new NotFoundException('Cannot find product items');
      }

      const productSub =
        await this.postgreService.product_sub_category.findFirst({
          where: { id: product.product_sub_category_id },
        });

      const productPrice = await this.postgreService.product_price.findFirst({
        where: { id: 1 },
      });

      console.log('productSub', productSub);

      const newProduct = { ...product };
      newProduct.product_sub_category = { ...productSub };

      const finalPayload: any = {
        name: newProduct.name,
        code: newProduct.code,
        description: newProduct.description,
        uom_id: newProduct.uom_id,
        product_sub_category_id: newProduct.product_sub_category_id,
        product_price: 1,
      };

      console.log('newProduct', newProduct);

      const productRes = await this.postgreService.product.create({
        data: { ...finalPayload },
      });

      // const productResItems = await this.postgreService.product_costing_item.createMany(productItems);
      console.log(
        'product',
        product,
        'product items',
        productItems,
        'productRes',
        productRes,
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
