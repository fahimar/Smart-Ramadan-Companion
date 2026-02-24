export declare class ZakatResultDto {
    id?: string;
    totalZakatable: number;
    nisabThreshold: number;
    isLiable: boolean;
    zakatAmount: number;
    breakdown: {
        gold: number;
        silver: number;
        cash: number;
        business: number;
        debtDeduction: number;
    };
    createdAt?: string;
}
