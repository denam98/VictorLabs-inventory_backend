import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RMIssueItemDTO {
  @IsOptional()
  @IsInt()
  id;

  @IsNotEmpty()
  @IsString()
  rm_id;

  @IsNotEmpty()
  @IsString()
  issue_to;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  qty;

  @IsOptional()
  @IsString()
  rm_issue_id;

  @IsOptional()
  @IsBoolean()
  is_active;
}
