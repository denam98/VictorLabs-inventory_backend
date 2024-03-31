import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddSupplierContactDTO {
  @IsOptional()
  @IsInt()
  id;

  @IsOptional()
  @IsString()
  telephone;

  @IsOptional()
  @IsString()
  email;

  @IsOptional()
  @IsString()
  mobile;

  @IsNotEmpty()
  @IsString()
  name;

  @IsOptional()
  @IsBoolean()
  is_active;

  @IsOptional()
  @IsString()
  supplier_id;
}
