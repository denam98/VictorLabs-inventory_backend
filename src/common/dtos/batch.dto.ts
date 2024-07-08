import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BatchDTO {
  @IsNotEmpty()
  @IsString()
  name;

  @IsNotEmpty()
  @IsString()
  start_date;

  @IsNotEmpty()
  @IsString()
  end_date;

  @IsOptional()
  @IsBoolean()
  is_complete;
}
