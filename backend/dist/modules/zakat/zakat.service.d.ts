import { GoldBasedNisabStrategy } from './strategies/gold-based-nisab.strategy';
import { ZakatRepository } from './zakat.repository';
import { CalculateZakatDto } from './dto/calculate-zakat.dto';
import { ZakatResultDto } from './dto/zakat-result.dto';
export declare class ZakatService {
    private readonly zakatRepository;
    private readonly nisabStrategy;
    constructor(zakatRepository: ZakatRepository, nisabStrategy: GoldBasedNisabStrategy);
    calculate(userId: string, dto: CalculateZakatDto): Promise<ZakatResultDto>;
    getHistory(userId: string): Promise<ZakatResultDto[]>;
    getNisab(): {
        nisabThreshold: number;
        method: string;
    };
    private computeZakat;
}
