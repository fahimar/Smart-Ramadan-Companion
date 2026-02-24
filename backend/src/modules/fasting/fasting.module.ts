import { Module } from '@nestjs/common';
import { FastingController } from './fasting.controller';
import { FastingService } from './fasting.service';
import { FastingRepository } from './fasting.repository';

@Module({
  controllers: [FastingController],
  providers:   [FastingService, FastingRepository],
})
export class FastingModule {}
