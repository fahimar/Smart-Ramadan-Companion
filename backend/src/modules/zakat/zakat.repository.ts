import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { ZakatResultDto } from './dto/zakat-result.dto';

interface SaveParams {
  goldValue:      number;
  silverValue:    number;
  cashSavings:    number;
  businessAssets: number;
  debts:          number;
  totalZakatable: number;
  zakatAmount:    number;
  nisabThreshold: number;
  isLiable:       boolean;
}

@Injectable()
export class ZakatRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async save(userId: string, params: SaveParams): Promise<{ id: string; createdAt: string }> {
    const { data, error } = await this.supabase
      .getClient()
      .from('zakat_records')
      .insert({
        user_id:         userId,
        gold_value:      params.goldValue,
        silver_value:    params.silverValue,
        cash_savings:    params.cashSavings,
        business_assets: params.businessAssets,
        debts:           params.debts,
        total_zakatable: params.totalZakatable,
        zakat_amount:    params.zakatAmount,
        nisab_threshold: params.nisabThreshold,
        is_liable:       params.isLiable,
      })
      .select('id, created_at')
      .single();

    if (error) throw new Error(error.message);
    return { id: data.id as string, createdAt: data.created_at as string };
  }

  async findAllByUser(userId: string): Promise<ZakatResultDto[]> {
    const { data } = await this.supabase
      .getClient()
      .from('zakat_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return (data ?? []).map(this.mapRow);
  }

  private mapRow(row: Record<string, unknown>): ZakatResultDto {
    return {
      id:             row.id as string,
      totalZakatable: row.total_zakatable as number,
      nisabThreshold: row.nisab_threshold as number,
      isLiable:       row.is_liable as boolean,
      zakatAmount:    row.zakat_amount as number,
      breakdown: {
        gold:          row.gold_value as number,
        silver:        row.silver_value as number,
        cash:          row.cash_savings as number,
        business:      row.business_assets as number,
        debtDeduction: row.debts as number,
      },
      createdAt: row.created_at as string,
    };
  }
}
