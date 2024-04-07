import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddRawMaterialDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsString()
  @IsNotEmpty()
  item_code;

  @IsOptional()
  @IsString()
  description;

  @IsOptional()
  @IsString()
  re_order_level;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  re_order_qty;

  @Optional()
  @IsBoolean()
  is_active;

  @Optional()
  @IsBoolean()
  is_inventory;

  @IsNotEmpty()
  @IsNumber()
  rm_category_id;

  @IsNotEmpty()
  @IsNumber()
  uom_id;
}
