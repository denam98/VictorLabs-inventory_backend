import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddStoreDTO {
  @IsNotEmpty()
  @IsString()
  name;

  @IsOptional()
  @IsBoolean()
  is_active;
}
