import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyContentService } from './daily-content.service';
import { DailyContentRepository } from './daily-content.repository';
import { PrayerRepository } from '../prayer/prayer.repository';

@Injectable()
export class DailyContentCron {
  private readonly logger = new Logger(DailyContentCron.name);

  constructor(
    private readonly dailyContentService: DailyContentService,
    private readonly dailyContentRepository: DailyContentRepository,
    private readonly prayerRepository: PrayerRepository,
  ) {}

  /**
   * Fetch and store a new Quran ayah daily at 03:00 UTC
   * (09:00 Bangladesh time — morning spiritual boost)
   */
  @Cron('0 3 * * *', { name: 'daily-content-fetch' })
  async fetchDailyContent(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    this.logger.log(`[Cron] Fetching daily content for ${today}`);

    const exists = await this.dailyContentRepository.findByDate(today);
    if (exists) {
      this.logger.log(`[Cron] Daily content already stored for ${today} — skipping`);
      return;
    }

    try {
      const content = await this.dailyContentService.fetchAndStore(today);
      this.logger.log(
        `[Cron] Stored Surah ${content.surahNumber}:${content.ayahNumber} for ${today}`,
      );
    } catch (err) {
      this.logger.error(`[Cron] Failed to fetch daily content`, (err as Error).message);
    }
  }

  /**
   * Clean up location cache older than 3 days — runs daily at 00:00 UTC
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'cache-cleanup' })
  async cleanupLocationCache(): Promise<void> {
    this.logger.log('[Cron] Running location cache cleanup');
    try {
      await this.prayerRepository.deleteOldCache(3);
      this.logger.log('[Cron] Location cache cleanup complete');
    } catch (err) {
      this.logger.error('[Cron] Cache cleanup failed', (err as Error).message);
    }
  }
}
