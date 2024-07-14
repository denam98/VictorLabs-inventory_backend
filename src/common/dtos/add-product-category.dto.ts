import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AddProductCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsString()
  @IsNotEmpty()
  code;

  @Optional()
  @IsBoolean()
  is_active;
}
