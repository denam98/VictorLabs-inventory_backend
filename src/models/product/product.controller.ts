import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
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
}
