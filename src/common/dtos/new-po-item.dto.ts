import { IsDecimal, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

class NewPoItemDto {
  @IsOptional()
  @IsString()
  id;

  @IsNotEmpty()
  @IsString()
  rm_id;

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
  price_per_unit;

  @IsOptional()
  @IsString()
  prn_item_id;
}

export default NewPoItemDto;
