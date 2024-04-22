import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { SrnItemDTO } from './srn-item.dto';

export class CreateSrnDTO {
  @IsNotEmpty()
  @IsString()
  srn_no;

  @IsNotEmpty()
  @IsString()
  grn_id;

  @IsOptional()
  @IsString()
  comment;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tax_type;

  @IsNotEmpty()
  items: SrnItemDTO[];
}
