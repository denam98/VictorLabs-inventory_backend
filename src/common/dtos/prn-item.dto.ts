import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PrnItemDto {
  @IsOptional()
  @IsString()
  id;

  @IsString()
  @IsNotEmpty()
  rm_id;

  @IsString()
  @IsOptional()
  prn_id;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  qty;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  ordered_qty;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  estimated_price_per_unit;
}
