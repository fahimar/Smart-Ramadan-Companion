import { ConfigService } from '@nestjs/config';
import { DailyContentRepository } from './daily-content.repository';
import { DailyContentResponseDto } from './dto/daily-content-response.dto';
export declare class DailyContentService {
    private readonly dailyContentRepository;
    private readonly config;
    private readonly apiBase;
    constructor(dailyContentRepository: DailyContentRepository, config: ConfigService);
    getTodayContent(): Promise<DailyContentResponseDto>;
    getHistory(days: number): Promise<DailyContentResponseDto[]>;
    fetchAndStore(date: string): Promise<DailyContentResponseDto>;
    private pickRandomSurah;
}
