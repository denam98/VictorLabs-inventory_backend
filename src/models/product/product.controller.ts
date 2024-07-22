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
import {
  AddProductCategoryDTO,
  AddProductDTO,
  AddProductSubCategoryDTO,
} from 'src/common/dtos/dto';

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

  @Post('categories/add')
  async addProductCategory(@Body() addProductCatDto: AddProductCategoryDTO) {
    return await this.productService.addProductCategory(addProductCatDto);
  }

  @Put('categories/delete/:id')
  async deleteCategory(@Param('id') id: number) {
    return await this.productService.deleteCategory(id);
  }

  @Put('subcategories/delete/:id')
  async deleteSubCategory(@Param('id') id: number) {
    return await this.productService.deleteSubCategory(id);
  }

  @Post('sub_categories/add')
  async addProductSubCategory(
    @Body() addProductSubCatDto: AddProductSubCategoryDTO,
  ) {
    return await this.productService.addProductSubCategory(addProductSubCatDto);
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

  @Get('/sub_categories/all')
  async getAllProductSubCategories() {
    return await this.productService.getAllProductSubCategories();
  }

  @Get('/sub_categories/:id')
  async getProductSubCategoryById(
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return await this.productService.getProductSubCategoryById(categoryId);
  }

  @Post('/costing_item/add')
  async createProductCostingItem(
    @Body() costingItem: { rm_id: string; qty: number },
  ) {
    return await this.productService.createProductCostingItem(costingItem);
  }

  @Get('/costing_item')
  async getAllProductCostingItems() {
    return await this.productService.getAllProductCostingItems();
  }

  @Post('/price_change/add')
  async createProductPriceChange(
    @Body() priceChange: { reason_name: string; is_active: boolean },
  ) {
    return await this.productService.createProductPriceChange(priceChange);
  }

  @Get('/price_change')
  async getAllProductPriceChanges() {
    return await this.productService.getAllProductPriceChanges();
  }

  @Post('/price/add')
  async addProductPrice(
    @Body()
    price: {
      price: number;
      reason_id: number;
      is_active: boolean;
      product_id: string;
    },
  ) {
    return await this.productService.addProductPrice(price);
  }

  @Get('/price')
  async getAllProductPrices() {
    return await this.productService.getAllProductPrices();
  }
}
