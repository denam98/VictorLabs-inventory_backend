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
import { RawMaterialService } from './raw-material.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { AddRawMaterialDTO } from 'src/common/dtos/dto';

@Controller('api/v1/raw-material')
export class RawMaterialController {
  constructor(private rawMaterialService: RawMaterialService) {}

  @Get('all')
  async getAllRawMaterials() {
    return await this.rawMaterialService.getAllRawMaterials();
  }

  @Get('categories/all')
  async getAllRawMaterialCategories() {
    return await this.rawMaterialService.getAllRawMaterialCategories();
  }

  @Get('uom/all')
  async getAllUoms() {
    return await this.rawMaterialService.getAllUoms();
  }

  @Get('/:id')
  async getRawMaterialById(@Param('id') materialId: string) {
    return await this.rawMaterialService.getRawMaterialById(materialId);
  }

  @Get('')
  async getRawMaterialByName(@Query('name') name: string) {
    return await this.rawMaterialService.findRawMaterialByName(name);
  }

  @Post('list')
  async getRawMaterialsByIds(@Body() idList: string[]) {
    console.log('ID list ==> ', idList);
    return await this.rawMaterialService.getRawMaterialsByIds(idList);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async addRawMaterial(@Body() addRawMaterialDto: AddRawMaterialDTO) {
    return await this.rawMaterialService.addRawMaterial(addRawMaterialDto);
  }

  @Delete('/:id')
  async deleteRawMaterial(@Param('id') materialId: string) {
    return await this.rawMaterialService.deleteRawMaterial(materialId);
  }

  @Post('/add-category')
  async addNewRawMaterialCategory(@Body() req: any) {
    return await this.rawMaterialService.createNewRawMaterialCategory(req.name);
  }

  @Put('/:id')
  async updateRawMaterial(
    @Param('id') materialId: string,
    @Body() addRawMaterialDto: AddRawMaterialDTO,
  ) {
    const params = {
      where: { id: materialId, is_active: true },
      data: addRawMaterialDto,
    };
    return await this.rawMaterialService.updateRawMaterial(params);
  }

  @Delete('/category/:id')
  async deleteRmCategory(@Param('id') id: number){
    return await this.rawMaterialService.deleteRawMaterialCategory(id);
  }
}
