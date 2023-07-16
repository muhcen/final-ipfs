import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateIpfDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  @Length(4, 200)
  description: string;

  @ApiProperty()
  @IsString()
  @Length(4, 100)
  metadata: string;

  @ApiProperty({ type: 'file', format: 'binary' })
  file: any;
}
