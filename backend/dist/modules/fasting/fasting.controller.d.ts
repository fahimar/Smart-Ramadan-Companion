import { FastingService } from './fasting.service';
import { LogFastDto } from './dto/log-fast.dto';
export declare class FastingController {
    private readonly fastingService;
    constructor(fastingService: FastingService);
    logFast(dto: LogFastDto, user: {
        id: string;
    }): Promise<import("./dto/fasting-log-response.dto").FastingLogDto>;
    updateFast(date: string, dto: Partial<LogFastDto>, user: {
        id: string;
    }): Promise<import("./dto/fasting-log-response.dto").FastingLogDto>;
    getHistory(user: {
        id: string;
    }): Promise<import("./dto/fasting-log-response.dto").FastingLogDto[]>;
    getToday(user: {
        id: string;
    }): Promise<import("./dto/fasting-log-response.dto").FastingLogDto | null>;
    getStats(user: {
        id: string;
    }): Promise<import("./dto/fasting-log-response.dto").FastingStatsDto>;
}
