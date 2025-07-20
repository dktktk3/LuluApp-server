// 4. services/CoinScanner.ts

import { fetchMarketSymbols, fetchPriceHistory } from './apiClient';

interface CoinInfo {
  symbol: string;
  volatilityScore: number;
  stabilityScore: number;
  effectiveVolatility: number;
}

export class CoinScanner {
  private scannedCoins: CoinInfo[] = [];

  async scanNewCoins(nHours: number, volatilityThreshold: number): Promise<CoinInfo[]> {
    const allSymbols = await fetchMarketSymbols();
    const coinScores: CoinInfo[] = [];

    for (const symbol of allSymbols) {
      try {
        const priceHistory = await fetchPriceHistory(symbol, nHours);
        if (!priceHistory || priceHistory.length === 0) continue;

        const volatility = calculateVolatilityLastNHours(priceHistory, nHours);
        const stability = calculateStabilityLastNHours(priceHistory, nHours);
        const effectiveVolatility = volatility * stability;

        if (effectiveVolatility >= volatilityThreshold) {
          coinScores.push({ symbol, volatilityScore: volatility, stabilityScore: stability, effectiveVolatility });
        }
      } catch {
        // 오류 무시
      }
    }

    coinScores.sort((a, b) => b.effectiveVolatility - a.effectiveVolatility);
    this.scannedCoins = coinScores;
    return coinScores;
  }

  getTopCoins(topN: number): CoinInfo[] {
    return this.scannedCoins.slice(0, topN);
  }
}

