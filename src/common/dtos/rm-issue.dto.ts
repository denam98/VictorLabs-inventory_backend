import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RMIssueDTO {
  @IsNotEmpty()
  @IsString()
  batch_id;

  @IsNotEmpty()
  @IsNumber()
  issue_note_no;
}
