import { DailyContentService } from './daily-content.service';
export declare class DailyContentController {
    private readonly dailyContentService;
    constructor(dailyContentService: DailyContentService);
    getToday(): Promise<import("./dto/daily-content-response.dto").DailyContentResponseDto>;
    getHistory(days?: string): Promise<import("./dto/daily-content-response.dto").DailyContentResponseDto[]>;
}
