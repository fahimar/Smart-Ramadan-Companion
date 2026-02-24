import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { CalculateZakatDto } from './dto/calculate-zakat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('zakat')
export class ZakatController {
  constructor(private readonly zakatService: ZakatService) {}

  /** GET /zakat/nisab — public */
  @Get('nisab')
  getNisab() {
    return this.zakatService.getNisab();
  }

  /** POST /zakat/calculate — requires auth */
  @Post('calculate')
  @UseGuards(JwtAuthGuard)
  calculate(@Body() dto: CalculateZakatDto, @CurrentUser() user: { id: string }) {
    return this.zakatService.calculate(user.id, dto);
  }

  /** GET /zakat/history — requires auth */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(@CurrentUser() user: { id: string }) {
    return this.zakatService.getHistory(user.id);
  }
}
