import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AccessRights } from 'src/access/enums/enums';

export class AccessDto {
  @IsNumber()
  @IsNotEmpty()
  fileId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsEnum(AccessRights)
  accessRight: AccessRights;
}

export class UpdateAccessDto {
  @IsNotEmpty()
  @IsEnum(AccessRights)
  accessRight: AccessRights;
}
