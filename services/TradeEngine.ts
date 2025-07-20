// 6. services/TradeEngine.ts

import { CoinScanner } from './CoinScanner';
import { evaluateTrade } from '../ai/TradeDecision';
import { manageRiskWithTrailingStop } from './RiskManager';
import { getCurrentPosition } from './tradeService';

let autoTradeInterval: NodeJS.Timeout | null = null;
const coinScanner = new CoinScanner();
const symbols: string[] = [];

export async function refreshTradeSymbols(nHours: number, volatilityThreshold: number, topN: number) {
  const scanned = await coinScanner.scanNewCoins(nHours, volatilityThreshold);
  const topCoins = coinScanner.getTopCoins(topN);
  symbols.length = 0;
  symbols.push(...topCoins.map(c => c.symbol));
  console.log(`자동매매 대상 코인 갱신: ${symbols.join(', ')}`);
}

export async function startTradeEngine() {
  if (autoTradeInterval) return;

  await refreshTradeSymbols(24, 0.5, 10);

  autoTradeInterval = setInterval(async () => {
    for (const symbol of symbols) {
      try {
        await evaluateTrade(symbol);

        const position = await getCurrentPosition(symbol);
        if (position) {
          await manageRiskWithTrailingStop(symbol, position.entryPrice, position.leverage);
        }
      } catch (error) {
        console.error(`자동매매 에러 (${symbol}):`, error);
      }
    }

    const now = new Date();
    if (now.getMinutes() % 30 === 0) {
      await refreshTradeSymbols(24, 0.5, 10);
    }
  }, 15000);
}

export async function stopTradeEngine() {
  if (autoTradeInterval) {
    clearInterval(autoTradeInterval);
    autoTradeInterval = null;
  }
}

