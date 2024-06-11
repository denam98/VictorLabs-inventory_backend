import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class AddCustomerContactDTO {
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
  @IsBoolean()
  is_active;

  @IsOptional()
  @IsString()
  customer_id;
}
