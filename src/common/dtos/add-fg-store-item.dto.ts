import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class AddFGStoreItemDTO {
  @IsNotEmpty()
  @IsString()
  store_id;

  @IsNotEmpty()
  @IsString()
  batch_id;

  @IsNotEmpty()
  @IsString()
  product_id;

  @IsNotEmpty()
  @IsString()
  finished_by;

  @IsNotEmpty()
  @IsString()
  transfer_note_no;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return String(value);
  })
  @IsDecimal()
  qty;
}
