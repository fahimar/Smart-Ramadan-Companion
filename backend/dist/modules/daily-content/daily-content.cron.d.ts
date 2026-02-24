import { DailyContentService } from './daily-content.service';
import { DailyContentRepository } from './daily-content.repository';
import { PrayerRepository } from '../prayer/prayer.repository';
export declare class DailyContentCron {
    private readonly dailyContentService;
    private readonly dailyContentRepository;
    private readonly prayerRepository;
    private readonly logger;
    constructor(dailyContentService: DailyContentService, dailyContentRepository: DailyContentRepository, prayerRepository: PrayerRepository);
    fetchDailyContent(): Promise<void>;
    cleanupLocationCache(): Promise<void>;
}
