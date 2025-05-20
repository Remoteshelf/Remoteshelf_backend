import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AccessRole } from '../enums/enums';

export class AccessDto {
  @ApiProperty({ description: 'The ID of the file to share' })
  @IsNumber()
  @IsNotEmpty()
  fileId: number;

  @ApiProperty({ description: 'The ID of the user to share with' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'The role to assign for file access',
    enum: AccessRole,
    enumName: 'AccessRole',
  })
  @IsNotEmpty()
  @IsEnum(AccessRole)
  role: AccessRole;
}

export class UpdateAccessDto {
  @ApiProperty({
    description: 'The new role to assign for file access',
    enum: AccessRole,
    enumName: 'AccessRole',
  })
  @IsNotEmpty()
  @IsEnum(AccessRole)
  role: AccessRole;
}
