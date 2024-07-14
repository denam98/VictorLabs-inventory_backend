import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddProductSubCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsString()
  @IsNotEmpty()
  code;

  @Optional()
  @IsBoolean()
  is_active;

  @IsNotEmpty()
  @IsNumber()
  category_id;

  @IsNotEmpty()
  @IsNumber()
  uom_id;
}
