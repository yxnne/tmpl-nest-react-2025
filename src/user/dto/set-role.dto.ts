import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SetRoleDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  roleId: number;
}