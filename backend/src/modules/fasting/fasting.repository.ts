import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { LogFastDto } from './dto/log-fast.dto';
import { FastingLogDto } from './dto/fasting-log-response.dto';

@Injectable()
export class FastingRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findByUserAndDate(userId: string, date: string): Promise<FastingLogDto | null> {
    const { data } = await this.supabase
      .getClient()
      .from('fasting_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    return data ? this.mapRow(data) : null;
  }

  async findAllByUser(userId: string): Promise<FastingLogDto[]> {
    const { data } = await this.supabase
      .getClient()
      .from('fasting_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    return (data ?? []).map(this.mapRow);
  }

  async create(userId: string, dto: LogFastDto): Promise<FastingLogDto> {
    const { data, error } = await this.supabase
      .getClient()
      .from('fasting_logs')
      .insert({ user_id: userId, date: dto.date, status: dto.status, note: dto.note })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRow(data);
  }

  async update(id: string, dto: Partial<LogFastDto>): Promise<FastingLogDto> {
    const { data, error } = await this.supabase
      .getClient()
      .from('fasting_logs')
      .update({ status: dto.status, note: dto.note })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRow(data);
  }

  private mapRow(row: Record<string, unknown>): FastingLogDto {
    return {
      id:        row.id as string,
      userId:    row.user_id as string,
      date:      row.date as string,
      status:    row.status as boolean,
      note:      row.note as string | undefined,
      createdAt: row.created_at as string,
    };
  }
}
