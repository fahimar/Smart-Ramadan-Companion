import { SupabaseService } from '../../common/supabase/supabase.service';
import { DailyContentResponseDto } from './dto/daily-content-response.dto';
interface SaveParams {
    date: string;
    surahNumber: number;
    ayahNumber: number;
    arabic: string;
    translation: string;
    sourceApi: string;
    lang: string;
}
export declare class DailyContentRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findByDate(date: string): Promise<DailyContentResponseDto | null>;
    findRecent(days: number): Promise<DailyContentResponseDto[]>;
    save(params: SaveParams): Promise<DailyContentResponseDto>;
    private mapRow;
}
export {};
