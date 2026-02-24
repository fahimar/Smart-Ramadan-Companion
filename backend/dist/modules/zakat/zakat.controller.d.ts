import { ZakatService } from './zakat.service';
import { CalculateZakatDto } from './dto/calculate-zakat.dto';
export declare class ZakatController {
    private readonly zakatService;
    constructor(zakatService: ZakatService);
    getNisab(): {
        nisabThreshold: number;
        method: string;
    };
    calculate(dto: CalculateZakatDto, user: {
        id: string;
    }): Promise<import("./dto/zakat-result.dto").ZakatResultDto>;
    getHistory(user: {
        id: string;
    }): Promise<import("./dto/zakat-result.dto").ZakatResultDto[]>;
}
