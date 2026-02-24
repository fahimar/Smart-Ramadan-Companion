import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DailyContentRepository } from './daily-content.repository';
import { DailyContentResponseDto } from './dto/daily-content-response.dto';

// Total verses in Quran per surah — used for random verse selection
const SURAH_VERSE_COUNTS: Record<number, number> = {
  1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,
  11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,
  21:112,22:78,23:118,24:64,25:77,26:227,27:93,28:88,29:69,30:60,
  31:34,32:30,33:73,34:54,35:45,36:83,37:182,38:88,39:75,40:85,
  41:54,42:53,43:89,44:59,45:37,46:35,47:38,48:29,49:18,50:45,
  51:60,52:49,53:62,54:55,55:78,56:96,57:29,58:22,59:24,60:13,
  61:14,62:11,63:11,64:18,65:12,66:12,67:30,68:52,69:52,70:44,
  71:28,72:28,73:20,74:56,75:40,76:31,77:50,78:40,79:46,80:42,
  81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,
  91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,
  101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,
  111:5,112:4,113:5,114:6,
};

@Injectable()
export class DailyContentService {
  private readonly apiBase: string;

  constructor(
    private readonly dailyContentRepository: DailyContentRepository,
    private readonly config: ConfigService,
  ) {
    this.apiBase = this.config.get('ALQURAN_API_BASE', 'https://alquran-api.pages.dev/api/quran');
  }

  async getTodayContent(): Promise<DailyContentResponseDto> {
    const today = new Date().toISOString().split('T')[0];
    const cached = await this.dailyContentRepository.findByDate(today);

    if (cached) return cached;

    // No cron has run yet — fetch on demand
    return this.fetchAndStore(today);
  }

  async getHistory(days: number): Promise<DailyContentResponseDto[]> {
    return this.dailyContentRepository.findRecent(days);
  }

  /** Called by cron + on-demand fetch */
  async fetchAndStore(date: string): Promise<DailyContentResponseDto> {
    const surahId  = this.pickRandomSurah();
    const verseMax = SURAH_VERSE_COUNTS[surahId] ?? 10;
    const verseId  = Math.floor(Math.random() * verseMax) + 1;

    const url = `${this.apiBase}/surah/${surahId}/verse/${verseId}?lang=bn`;
    const { data } = await axios.get<{
      arabic:      string;
      translation: string;
    }>(url);

    return this.dailyContentRepository.save({
      date,
      surahNumber: surahId,
      ayahNumber:  verseId,
      arabic:      data.arabic,
      translation: data.translation,
      sourceApi:   'alquran-api.pages.dev',
      lang:        'bn',
    });
  }

  private pickRandomSurah(): number {
    // Prefer shorter surahs (more meaningful for daily reading)
    return Math.floor(Math.random() * 114) + 1;
  }
}
