import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

interface CacheRow {
  prayer_times: Record<string, string>;
}

interface SaveCacheParams {
  city:        string;
  country:     string;
  date:        string;
  prayerTimes: Record<string, string>;
}

@Injectable()
export class PrayerRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findCache(
    city: string,
    country: string,
    date: string,
  ): Promise<Record<string, string> | null> {
    const { data } = await this.supabase
      .getClient()
      .from('locations_cache')
      .select('prayer_times')
      .eq('city', city)
      .eq('country', country)
      .eq('date', date)
      .maybeSingle<CacheRow>();

    return data?.prayer_times ?? null;
  }

  async saveCache(params: SaveCacheParams): Promise<void> {
    await this.supabase
      .getClient()
      .from('locations_cache')
      .upsert({
        city:         params.city,
        country:      params.country,
        date:         params.date,
        prayer_times: params.prayerTimes,
      });
  }

  async deleteOldCache(daysOld: number): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    await this.supabase
      .getClient()
      .from('locations_cache')
      .delete()
      .lt('date', cutoff.toISOString().split('T')[0]);
  }
}
