import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BatchItemDTO {
  @IsOptional()
  @IsInt()
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
  @IsString()
  batch_id;

  @IsOptional()
  @IsBoolean()
  is_active;
}
