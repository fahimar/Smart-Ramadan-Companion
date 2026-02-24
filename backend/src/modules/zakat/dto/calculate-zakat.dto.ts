import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateZakatDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  goldValue: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  silverValue: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cashSavings: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  businessAssets: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  debts: number = 0;
}
