import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SrnItemDTO {
  @IsOptional()
  @IsString()
  id;

  @IsString()
  @IsNotEmpty()
  rm_id;

  @IsString()
  @IsOptional()
  srn_id;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  qty;

  @IsOptional()
  @IsString()
  reason;

  @IsOptional()
  @IsString()
  returned_by;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  discount;
}
