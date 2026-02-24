export declare class FastingLogDto {
    id: string;
    userId: string;
    date: string;
    status: boolean;
    note?: string;
    createdAt: string;
}
export declare class FastingStatsDto {
    totalDays: number;
    keptDays: number;
    missedDays: number;
    pendingDays: number;
    percentage: number;
}
