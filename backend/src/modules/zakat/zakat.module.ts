import { Module } from '@nestjs/common';
import { ZakatController } from './zakat.controller';
import { ZakatService } from './zakat.service';
import { ZakatRepository } from './zakat.repository';
import { GoldBasedNisabStrategy } from './strategies/gold-based-nisab.strategy';

@Module({
  controllers: [ZakatController],
  providers:   [ZakatService, ZakatRepository, GoldBasedNisabStrategy],
})
export class ZakatModule {}
