import { IsDateString, IsBoolean, IsOptional, IsString } from 'class-validator';

export class LogFastDto {
  @IsDateString()
  date: string;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
