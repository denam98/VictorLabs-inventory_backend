import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('api/v1/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/all')
  async getAllProductCategories() {
    try {
      console.log('vame here');
      return await this.productService.getAllProductCategories();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @Get('/allSubCategories/:id')
  async getAllProductSubCategories(@Param('id') categoryId: number) {
    try {
      console.log('vame here');
      return await this.productService.getAllProductSubCategories(categoryId);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  @Post('/add')
  async createNewProduct(@Body() req: any) {
    try {
      return await this.productService.createNewProduct(
        req.product,
        req.productItems,
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
