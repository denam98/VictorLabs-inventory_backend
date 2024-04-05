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
  getAllRawMaterials() {
    return this.rawMaterialService.getAllRawMaterials();
  }

  @Get('categories/all')
  getAllRawMaterialCategories() {
    return this.rawMaterialService.getAllRawMaterialCategories();
  }

  @Get('uom/all')
  getAllUoms() {
    return this.rawMaterialService.getAllUoms();
  }

  @Get('/:id')
  getRawMaterialById(@Param('id') materialId: string) {
    return this.rawMaterialService.getRawMaterialById(materialId);
  }

  @Get('/')
  getRawMaterialByName(@Query('name') name: string) {
    return this.rawMaterialService.findRawMaterialByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  addRawMaterial(@Body() addRawMaterialDto: AddRawMaterialDTO) {
    return this.rawMaterialService.addRawMaterial(addRawMaterialDto);
  }

  @Delete('/:id')
  deleteRawMaterial(@Param('id') materialId: string) {
    return this.rawMaterialService.deleteRawMaterial(materialId);
  }

  @Put('/:id')
  updateRawMaterial(
    @Param('id') materialId: string,
    @Body() addRawMaterialDto: AddRawMaterialDTO,
  ) {
    const params = {
      where: { id: materialId, is_active: true },
      data: addRawMaterialDto,
    };
    return this.rawMaterialService.updateRawMaterial(params);
  }
}
