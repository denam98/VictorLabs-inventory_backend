import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddSupplierDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsOptional()
  @IsString()
  br_number;

  @IsOptional()
  @IsString()
  vat_reg_no;

  @IsOptional()
  @IsString()
  address;

  @IsOptional()
  @IsString()
  telephone;

  @IsOptional()
  @IsString()
  fax;

  @IsOptional()
  @IsBoolean()
  is_active;
}
