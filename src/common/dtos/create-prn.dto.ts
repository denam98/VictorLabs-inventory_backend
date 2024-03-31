import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PrnItemDto } from './prn-item.dto';

export class CreatePrnDTO {
  @IsNotEmpty()
  @IsString()
  prn_no;

  @IsNotEmpty()
  @IsString()
  requested_by;

  @IsNotEmpty()
  @IsString()
  approved_by;

  @IsNotEmpty()
  @IsInt()
  priority_id;

  @IsOptional()
  @IsString()
  remark;

  @IsNotEmpty()
  items: PrnItemDto[];
}
