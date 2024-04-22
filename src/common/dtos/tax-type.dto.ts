import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  IsNumber,
} from 'class-validator';

export class TaxTypeDTO {
  @IsString()
  @IsNotEmpty()
  name;

  @IsNumber()
  @IsOptional()
  id;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  value;
}
