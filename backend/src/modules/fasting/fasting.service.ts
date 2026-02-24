import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FastingRepository } from './fasting.repository';
import { LogFastDto } from './dto/log-fast.dto';
import { FastingLogDto, FastingStatsDto } from './dto/fasting-log-response.dto';

const RAMADAN_DAYS = 30;

@Injectable()
export class FastingService {
  constructor(private readonly fastingRepository: FastingRepository) {}

  async logFast(userId: string, dto: LogFastDto): Promise<FastingLogDto> {
    const existing = await this.fastingRepository.findByUserAndDate(userId, dto.date);
    if (existing) throw new ConflictException(`Fast already logged for ${dto.date}`);
    return this.fastingRepository.create(userId, dto);
  }

  async updateFast(userId: string, date: string, dto: Partial<LogFastDto>): Promise<FastingLogDto> {
    const existing = await this.fastingRepository.findByUserAndDate(userId, date);
    if (!existing) throw new NotFoundException(`No fasting log found for ${date}`);
    return this.fastingRepository.update(existing.id, dto);
  }

  async getHistory(userId: string): Promise<FastingLogDto[]> {
    return this.fastingRepository.findAllByUser(userId);
  }

  async getToday(userId: string): Promise<FastingLogDto | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.fastingRepository.findByUserAndDate(userId, today);
  }

  async getStats(userId: string): Promise<FastingStatsDto> {
    const logs      = await this.fastingRepository.findAllByUser(userId);
    const keptDays  = logs.filter((l) => l.status).length;
    const missedDays = logs.filter((l) => !l.status).length;
    const pendingDays = RAMADAN_DAYS - logs.length;

    return {
      totalDays:   RAMADAN_DAYS,
      keptDays,
      missedDays,
      pendingDays,
      percentage:  Math.round((keptDays / RAMADAN_DAYS) * 100 * 10) / 10,
    };
  }
}
