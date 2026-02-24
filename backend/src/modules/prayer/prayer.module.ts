import { Module } from '@nestjs/common';
import { PrayerController } from './prayer.controller';
import { PrayerService } from './prayer.service';
import { PrayerRepository } from './prayer.repository';

@Module({
  controllers: [PrayerController],
  providers:   [PrayerService, PrayerRepository],
  exports:     [PrayerRepository],
})
export class PrayerModule {}
