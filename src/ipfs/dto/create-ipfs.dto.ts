import { IsOptional, IsString, Length } from 'class-validator';

export class CreateIpfDto {
  @IsString()
  userId: string;

  @IsString()
  @Length(4, 200)
  description: string;

  @IsString()
  @Length(4, 100)
  metadata: string;
}
