import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  address;

  @IsOptional()
  @IsBoolean()
  is_active;

  @IsOptional()
  @IsString()
  supplier_id;
}
