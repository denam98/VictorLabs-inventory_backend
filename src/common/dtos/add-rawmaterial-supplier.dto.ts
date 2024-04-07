import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddRawMaterialSupplierDTO {
  @IsString()
  @IsNotEmpty()
  rm_id;
  @IsString()
  @IsNotEmpty()
  supplier_id;
  @IsOptional()
  @IsBoolean()
  is_active;
}
