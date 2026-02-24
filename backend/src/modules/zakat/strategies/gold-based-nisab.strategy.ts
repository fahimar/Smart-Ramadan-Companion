import { Injectable } from '@nestjs/common';
import { ZakatCalculationStrategy } from './zakat-calculation.strategy';

/**
 * Nisab based on 85g of gold.
 * BDT price per gram of gold (approx) — ideally fetch live from an API.
 * For MVP: hardcoded. Future: inject live price.
 */
const GOLD_PRICE_PER_GRAM_BDT = 9_500; // ~approx BDT 2026
const GOLD_NISAB_GRAMS         = 85;

@Injectable()
export class GoldBasedNisabStrategy implements ZakatCalculationStrategy {
  getNisabThreshold(): number {
    return GOLD_PRICE_PER_GRAM_BDT * GOLD_NISAB_GRAMS;
  }
}
