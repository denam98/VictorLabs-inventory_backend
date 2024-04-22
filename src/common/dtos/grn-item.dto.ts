import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GrnItemDTO {
  @IsOptional()
  @IsString()
  id;

  @IsString()
  @IsOptional()
  grn_id;

  @IsNotEmpty()
  @IsString()
  rm_id;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  qty;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  price_per_unit;

  @IsNotEmpty()
  @IsString()
  recieved_type;
}
