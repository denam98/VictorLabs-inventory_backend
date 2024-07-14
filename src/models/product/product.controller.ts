import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDTO } from 'src/common/dtos/dto';

@Controller('api/v1/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get('categories/all')
  async getAllProductCategories() {
    return await this.productService.getAllProductCategories();
  }

  @Get('/:id')
  async getProductById(@Param('id') productId: string) {
    return await this.productService.getProductById(productId);
  }

  @Get('')
  async getProductByName(@Query('name') name: string) {
    return await this.productService.findProductByName(name);
  }

  @Post('list')
  async getProductsByIds(@Body() idList: string[]) {
    console.log('ID list ==> ', idList);
    return await this.productService.getProductsByIds(idList);
  }

  @Post('/add')
  async addProduct(@Body() addProductDto: AddProductDTO) {
    return await this.productService.addProduct(addProductDto);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') productId: string) {
    return await this.productService.deleteProduct(productId);
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() addProductDto: AddProductDTO,
  ) {
    const params = {
      where: { id: productId, is_active: true },
      data: addProductDto,
    };
    return await this.productService.updateProduct(params);
  }

  @Get('/sub_categories')
  async getAllProductSubCategories() {
    return await this.productService.getAllProductSubCategories();
  }

  @Get('/sub_categories/:id')
  async getProductSubCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return await this.productService.getProductSubCategoryById(categoryId);
  }
}
