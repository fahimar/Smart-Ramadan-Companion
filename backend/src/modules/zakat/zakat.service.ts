import { Injectable } from '@nestjs/common';
import { GoldBasedNisabStrategy } from './strategies/gold-based-nisab.strategy';
import { ZakatRepository } from './zakat.repository';
import { CalculateZakatDto } from './dto/calculate-zakat.dto';
import { ZakatResultDto } from './dto/zakat-result.dto';

const ZAKAT_RATE = 0.025;

@Injectable()
export class ZakatService {
  constructor(
    private readonly zakatRepository: ZakatRepository,
    private readonly nisabStrategy: GoldBasedNisabStrategy,
  ) {}

  async calculate(userId: string, dto: CalculateZakatDto): Promise<ZakatResultDto> {
    const nisabThreshold = this.nisabStrategy.getNisabThreshold();
    const result         = this.computeZakat(dto, nisabThreshold);

    const saved = await this.zakatRepository.save(userId, { ...dto, ...result, nisabThreshold });
    return { ...result, id: saved.id, createdAt: saved.createdAt, nisabThreshold };
  }

  async getHistory(userId: string): Promise<ZakatResultDto[]> {
    return this.zakatRepository.findAllByUser(userId);
  }

  getNisab(): { nisabThreshold: number; method: string } {
    return {
      nisabThreshold: this.nisabStrategy.getNisabThreshold(),
      method:         'Gold-based (85g)',
    };
  }

  private computeZakat(
    dto: CalculateZakatDto,
    nisabThreshold: number,
  ): Omit<ZakatResultDto, 'id' | 'createdAt' | 'nisabThreshold'> {
    const totalZakatable =
      dto.goldValue + dto.silverValue + dto.cashSavings + dto.businessAssets - dto.debts;

    const isLiable   = totalZakatable >= nisabThreshold;
    const zakatAmount = isLiable ? Math.round(totalZakatable * ZAKAT_RATE * 100) / 100 : 0;

    return {
      totalZakatable,
      isLiable,
      zakatAmount,
      breakdown: {
        gold:          dto.goldValue,
        silver:        dto.silverValue,
        cash:          dto.cashSavings,
        business:      dto.businessAssets,
        debtDeduction: dto.debts,
      },
    };
  }
}
