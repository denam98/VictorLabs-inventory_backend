import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddSupplierDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsNumber()
  @IsNotEmpty()
  br_number;

  @IsNumber()
  @IsNotEmpty()
  vat;

  @IsOptional()
  @IsBoolean()
  is_active;
}
