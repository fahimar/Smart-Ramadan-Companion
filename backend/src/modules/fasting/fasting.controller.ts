import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { FastingService } from './fasting.service';
import { LogFastDto } from './dto/log-fast.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('fasting')
@UseGuards(JwtAuthGuard)
export class FastingController {
  constructor(private readonly fastingService: FastingService) {}

  @Post('log')
  logFast(@Body() dto: LogFastDto, @CurrentUser() user: { id: string }) {
    return this.fastingService.logFast(user.id, dto);
  }

  @Patch('log/:date')
  updateFast(
    @Param('date') date: string,
    @Body() dto: Partial<LogFastDto>,
    @CurrentUser() user: { id: string },
  ) {
    return this.fastingService.updateFast(user.id, date, dto);
  }

  @Get('history')
  getHistory(@CurrentUser() user: { id: string }) {
    return this.fastingService.getHistory(user.id);
  }

  @Get('today')
  getToday(@CurrentUser() user: { id: string }) {
    return this.fastingService.getToday(user.id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: { id: string }) {
    return this.fastingService.getStats(user.id);
  }
}
