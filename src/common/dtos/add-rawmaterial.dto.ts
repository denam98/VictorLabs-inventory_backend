import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddRawMaterialDTO {
  @IsString()
  @IsNotEmpty()
  name;
  @IsNumber()
  @IsNotEmpty()
  item_code;
  @Optional()
  @IsBoolean()
  is_active;
  @Optional()
  @IsBoolean()
  is_inventory;
  @IsNotEmpty()
  @IsNumber()
  rm_sub_category_id;
  @IsNotEmpty()
  @IsNumber()
  uom_id;
}
