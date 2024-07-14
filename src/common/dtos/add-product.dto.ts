import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddProductDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsString()
  @IsNotEmpty()
  code;

  @IsOptional()
  @IsString()
  description;

  @Optional()
  @IsBoolean()
  is_active;

  @Optional()
  @IsBoolean()
  is_customized;

  @IsNotEmpty()
  @IsNumber()
  product_price_id;

  @IsNotEmpty()
  @IsNumber()
  product_sub_category_id;

  @IsNotEmpty()
  @IsNumber()
  uom_id;
}
