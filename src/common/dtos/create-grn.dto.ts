import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GrnItemDTO } from './dto';

export class CreateGrnDTO {
  @IsNotEmpty()
  @IsString()
  grn_no;

  @IsOptional()
  @IsString()
  comment;

  @IsOptional()
  @IsString()
  supplier_inv_no;

  @IsNotEmpty()
  @IsString()
  po_id;

  @IsOptional()
  @IsString()
  discount_type;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tax_type;

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  discount;

  @IsNotEmpty()
  items: GrnItemDTO[];
}
