import { Controller, Get, Query } from '@nestjs/common';
import { DailyContentService } from './daily-content.service';

@Controller('daily-content')
export class DailyContentController {
  constructor(private readonly dailyContentService: DailyContentService) {}

  /** GET /daily-content — public, no auth needed */
  @Get()
  getToday() {
    return this.dailyContentService.getTodayContent();
  }

  /** GET /daily-content/history?days=7 */
  @Get('history')
  getHistory(@Query('days') days = '7') {
    return this.dailyContentService.getHistory(Number(days));
  }
}
