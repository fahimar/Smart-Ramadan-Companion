export declare class PrayerTimesResponseDto {
    date: string;
    city: string;
    country: string;
    timings: {
        Fajr: string;
        Sunrise: string;
        Dhuhr: string;
        Asr: string;
        Maghrib: string;
        Isha: string;
    };
    sehriTime: string;
    iftarTime: string;
    nextPrayer: {
        name: string;
        time: string;
        remainingSeconds: number;
    };
}
