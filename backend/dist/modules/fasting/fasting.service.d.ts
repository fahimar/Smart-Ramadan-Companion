import { FastingRepository } from './fasting.repository';
import { LogFastDto } from './dto/log-fast.dto';
import { FastingLogDto, FastingStatsDto } from './dto/fasting-log-response.dto';
export declare class FastingService {
    private readonly fastingRepository;
    constructor(fastingRepository: FastingRepository);
    logFast(userId: string, dto: LogFastDto): Promise<FastingLogDto>;
    updateFast(userId: string, date: string, dto: Partial<LogFastDto>): Promise<FastingLogDto>;
    getHistory(userId: string): Promise<FastingLogDto[]>;
    getToday(userId: string): Promise<FastingLogDto | null>;
    getStats(userId: string): Promise<FastingStatsDto>;
}
