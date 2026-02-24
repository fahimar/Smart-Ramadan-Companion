import { PrayerService } from './prayer.service';
import { GetPrayerTimesDto } from './dto/get-prayer-times.dto';
export declare class PrayerController {
    private readonly prayerService;
    constructor(prayerService: PrayerService);
    getPrayerTimes(query: GetPrayerTimesDto): Promise<import("./dto/prayer-times-response.dto").PrayerTimesResponseDto>;
}
