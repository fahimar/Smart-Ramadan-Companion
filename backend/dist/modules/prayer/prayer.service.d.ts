import { ConfigService } from '@nestjs/config';
import { PrayerRepository } from './prayer.repository';
import { GetPrayerTimesDto } from './dto/get-prayer-times.dto';
import { PrayerTimesResponseDto } from './dto/prayer-times-response.dto';
export declare class PrayerService {
    private readonly prayerRepository;
    private readonly config;
    private readonly aladhanBase;
    constructor(prayerRepository: PrayerRepository, config: ConfigService);
    getPrayerTimes(dto: GetPrayerTimesDto): Promise<PrayerTimesResponseDto>;
    private buildResponse;
    private findNextPrayer;
    private stripTimezone;
}
