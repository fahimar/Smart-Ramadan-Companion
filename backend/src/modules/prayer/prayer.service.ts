import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrayerRepository } from './prayer.repository';
import { GetPrayerTimesDto } from './dto/get-prayer-times.dto';
import { PrayerTimesResponseDto } from './dto/prayer-times-response.dto';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerName = (typeof PRAYER_ORDER)[number];

@Injectable()
export class PrayerService {
  private readonly aladhanBase: string;

  constructor(
    private readonly prayerRepository: PrayerRepository,
    private readonly config: ConfigService,
  ) {
    this.aladhanBase = this.config.get('ALADHAN_API_BASE', 'https://api.aladhan.com/v1');
  }

  async getPrayerTimes(dto: GetPrayerTimesDto): Promise<PrayerTimesResponseDto> {
    if (!dto.city && (!dto.lat || !dto.lng)) {
      throw new BadRequestException('Provide either city or lat/lng coordinates');
    }

    const city    = dto.city ?? 'Dhaka';
    const country = dto.country ?? 'BD';
    const today   = new Date().toISOString().split('T')[0];

    // Cache check
    const cached = await this.prayerRepository.findCache(city, country, today);
    if (cached) return this.buildResponse(cached, city, country, today);

    // Fetch from Aladhan API
    const url = dto.lat && dto.lng
      ? `${this.aladhanBase}/timings?latitude=${dto.lat}&longitude=${dto.lng}&method=1`
      : `${this.aladhanBase}/timingsByCity?city=${city}&country=${country}&method=1`;

    const { data } = await axios.get(url);
    const timings: Record<string, string> = data.data.timings;

    const cleaned = {
      Fajr:    this.stripTimezone(timings.Fajr),
      Sunrise: this.stripTimezone(timings.Sunrise),
      Dhuhr:   this.stripTimezone(timings.Dhuhr),
      Asr:     this.stripTimezone(timings.Asr),
      Maghrib: this.stripTimezone(timings.Maghrib),
      Isha:    this.stripTimezone(timings.Isha),
    };

    // Save to cache
    await this.prayerRepository.saveCache({ city, country, date: today, prayerTimes: cleaned });

    return this.buildResponse(cleaned, city, country, today);
  }

  private buildResponse(
    timings: Record<string, string>,
    city: string,
    country: string,
    date: string,
  ): PrayerTimesResponseDto {
    return {
      date,
      city,
      country,
      timings: timings as PrayerTimesResponseDto['timings'],
      sehriTime:  timings.Fajr,
      iftarTime:  timings.Maghrib,
      nextPrayer: this.findNextPrayer(timings),
    };
  }

  private findNextPrayer(timings: Record<string, string>): PrayerTimesResponseDto['nextPrayer'] {
    const now = new Date();

    for (const name of PRAYER_ORDER) {
      const [h, m] = timings[name].split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(h, m, 0, 0);

      if (prayerTime > now) {
        const remainingSeconds = Math.floor((prayerTime.getTime() - now.getTime()) / 1000);
        return { name: name as PrayerName, time: timings[name], remainingSeconds };
      }
    }

    // Past Isha — next is Fajr tomorrow
    const [h, m] = timings.Fajr.split(':').map(Number);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(h, m, 0, 0);
    const remainingSeconds = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
    return { name: 'Fajr', time: timings.Fajr, remainingSeconds };
  }

  private stripTimezone(time: string): string {
    // "04:32 (BST)" → "04:32"
    return time.split(' ')[0];
  }
}
