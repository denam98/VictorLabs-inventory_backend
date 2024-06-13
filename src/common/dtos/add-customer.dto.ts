import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AddCustomerDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsNotEmpty()
  @IsString()
  type;

  @IsOptional()
  @IsString()
  code;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  vat;

  @IsOptional()
  @IsString()
  website;

  @IsOptional()
  @IsString()
  telephone;

  @IsOptional()
  @IsString()
  email;

  @IsOptional()
  @IsString()
  address;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  credit_amount;

  @IsOptional()
  @IsNumber()
  credit_period;

  @IsOptional()
  @IsBoolean()
  is_credit_allowed;

  @IsOptional()
  @IsBoolean()
  is_discount_allowed;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  max_discount_percentage;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  max_discount_value;

  @IsOptional()
  @IsBoolean()
  is_active;
}
