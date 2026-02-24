import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrayerModule } from './modules/prayer/prayer.module';
import { FastingModule } from './modules/fasting/fasting.module';
import { DailyContentModule } from './modules/daily-content/daily-content.module';
import { ZakatModule } from './modules/zakat/zakat.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    SupabaseModule,
    AuthModule,
    PrayerModule,
    FastingModule,
    DailyContentModule,
    ZakatModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
