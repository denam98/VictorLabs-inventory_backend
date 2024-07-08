import { IsArray, IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PoItemDTO } from "./po-item.dto";
import newPoItemDto from "./new-po-item.dto";

class CreateNewPoDto {
  @IsNotEmpty()
  @IsString()
  supplier_id;

  @IsOptional()
  @IsString()
  po_no;

  @IsOptional()
  @IsString()
  special_note;

  @IsOptional()
  @IsString()
  delivery_location;

  @IsOptional()
  @IsString()
  currency;

  @IsOptional()
  @IsString()
  state;

  @IsOptional()
  @IsString()
  discount_type;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tax_type: number[];

  @IsOptional()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  discount;

  @IsOptional()
  @IsDateString()
  deliver_before;

  @IsOptional()
  @IsString()
  contact_person: string;

  @IsNotEmpty()
  items: newPoItemDto[];
}

export default CreateNewPoDto;
