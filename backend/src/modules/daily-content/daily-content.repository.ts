import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { DailyContentResponseDto } from './dto/daily-content-response.dto';

interface SaveParams {
  date:        string;
  surahNumber: number;
  ayahNumber:  number;
  arabic:      string;
  translation: string;
  sourceApi:   string;
  lang:        string;
}

@Injectable()
export class DailyContentRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findByDate(date: string): Promise<DailyContentResponseDto | null> {
    const { data } = await this.supabase
      .getClient()
      .from('daily_content')
      .select('*')
      .eq('date', date)
      .maybeSingle();

    return data ? this.mapRow(data) : null;
  }

  async findRecent(days: number): Promise<DailyContentResponseDto[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await this.supabase
      .getClient()
      .from('daily_content')
      .select('*')
      .gte('date', since.toISOString().split('T')[0])
      .order('date', { ascending: false });

    return (data ?? []).map(this.mapRow);
  }

  async save(params: SaveParams): Promise<DailyContentResponseDto> {
    const { data, error } = await this.supabase
      .getClient()
      .from('daily_content')
      .upsert({
        date:         params.date,
        surah_number: params.surahNumber,
        ayah_number:  params.ayahNumber,
        arabic:       params.arabic,
        translation:  params.translation,
        source_api:   params.sourceApi,
        lang:         params.lang,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRow(data);
  }

  private mapRow(row: Record<string, unknown>): DailyContentResponseDto {
    return {
      id:          row.id as string,
      date:        row.date as string,
      surahNumber: row.surah_number as number,
      ayahNumber:  row.ayah_number as number,
      arabic:      row.arabic as string,
      translation: row.translation as string,
      sourceApi:   row.source_api as string,
      lang:        row.lang as string,
    };
  }
}
