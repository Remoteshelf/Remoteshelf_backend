import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FolderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
