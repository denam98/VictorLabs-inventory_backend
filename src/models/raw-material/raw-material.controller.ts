import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { AddRawMaterialDTO } from 'src/common/dtos/dto';

@Controller('api/v1/raw-material')
export class RawMaterialController {
  constructor(private rawMaterialService: RawMaterialService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllRawMaterials() {
    return this.rawMaterialService.getAllRawMaterials();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getRawMaterialById(@Param('id') materialId: string) {
    return this.rawMaterialService.getRawMaterialById(materialId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  addRawMaterial(@Body() addRawMaterialDto: AddRawMaterialDTO) {
    return this.rawMaterialService.addRawMaterial(addRawMaterialDto);
  }

  // @UseGuards(JwtAuthGuard)
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
