import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class GetPrayerTimesDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumberString()
  lat?: string;

  @IsOptional()
  @IsNumberString()
  lng?: string;
}
