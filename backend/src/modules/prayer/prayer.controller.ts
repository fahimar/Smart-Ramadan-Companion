import { Controller, Get, Query } from '@nestjs/common';
import { PrayerService } from './prayer.service';
import { GetPrayerTimesDto } from './dto/get-prayer-times.dto';

@Controller('prayer')
export class PrayerController {
  constructor(private readonly prayerService: PrayerService) {}

  @Get('times')
  getPrayerTimes(@Query() query: GetPrayerTimesDto) {
    return this.prayerService.getPrayerTimes(query);
  }
}
