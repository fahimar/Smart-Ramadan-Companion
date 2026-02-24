import { SupabaseService } from '../../common/supabase/supabase.service';
import { LogFastDto } from './dto/log-fast.dto';
import { FastingLogDto } from './dto/fasting-log-response.dto';
export declare class FastingRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findByUserAndDate(userId: string, date: string): Promise<FastingLogDto | null>;
    findAllByUser(userId: string): Promise<FastingLogDto[]>;
    create(userId: string, dto: LogFastDto): Promise<FastingLogDto>;
    update(id: string, dto: Partial<LogFastDto>): Promise<FastingLogDto>;
    private mapRow;
}
