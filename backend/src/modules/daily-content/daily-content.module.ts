import { Module } from '@nestjs/common';
import { DailyContentController } from './daily-content.controller';
import { DailyContentService } from './daily-content.service';
import { DailyContentRepository } from './daily-content.repository';
import { DailyContentCron } from './daily-content.cron';
import { PrayerModule } from '../prayer/prayer.module';

@Module({
  imports:     [PrayerModule],
  controllers: [DailyContentController],
  providers:   [DailyContentService, DailyContentRepository, DailyContentCron],
})
export class DailyContentModule {}
