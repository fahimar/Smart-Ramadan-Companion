import { SupabaseService } from '../../common/supabase/supabase.service';
import { ZakatResultDto } from './dto/zakat-result.dto';
interface SaveParams {
    goldValue: number;
    silverValue: number;
    cashSavings: number;
    businessAssets: number;
    debts: number;
    totalZakatable: number;
    zakatAmount: number;
    nisabThreshold: number;
    isLiable: boolean;
}
export declare class ZakatRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    save(userId: string, params: SaveParams): Promise<{
        id: string;
        createdAt: string;
    }>;
    findAllByUser(userId: string): Promise<ZakatResultDto[]>;
    private mapRow;
}
export {};
