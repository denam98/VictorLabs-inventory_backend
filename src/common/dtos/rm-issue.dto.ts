import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RMIssueDTO {
  @IsNotEmpty()
  @IsString()
  batch_id;

  @IsNotEmpty()
  @IsNumber()
  issue_note_no;

  @IsOptional()
  @IsBoolean()
  is_active;
}
