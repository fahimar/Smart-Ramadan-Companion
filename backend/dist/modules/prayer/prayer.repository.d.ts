import { SupabaseService } from '../../common/supabase/supabase.service';
interface SaveCacheParams {
    city: string;
    country: string;
    date: string;
    prayerTimes: Record<string, string>;
}
export declare class PrayerRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findCache(city: string, country: string, date: string): Promise<Record<string, string> | null>;
    saveCache(params: SaveCacheParams): Promise<void>;
    deleteOldCache(daysOld: number): Promise<void>;
}
export {};
