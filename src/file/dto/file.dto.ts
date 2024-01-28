import { IsNumber } from 'class-validator';

export class FileDto {
  @IsNumber()
  folderId?: number;

  @IsNumber()
  userId?: number;
}
