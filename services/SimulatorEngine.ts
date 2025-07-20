import simData from '../data/simData.json';
import { predictScore } from '../ai/Predictor';
import { logSimResult } from '../utils/Logger';

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SimPosition {
  entryPrice: number;
  side: 'long' | 'short';
  leverage: number;
}

let position: SimPosition | null = null;
let capital = 1000;
let win = 0, loss = 0;
let startPrice: number | null = null;

export async function runSimulation() {
  for (const candle of simData as Candle[]) {
    if (!startPrice) {
      startPrice = candle.open;
      console.log(`[시작가]: ${startPrice}`);
    }

    const score = await predictScore(candle);

    if (!position && Math.abs(score) > 7) {
      position = {
        side: score > 0 ? 'long' : 'short',
        entryPrice: candle.close,
        leverage: score > 9 ? 20 : 5
      };
      console.log(`[진입] ${position.side} @ ${position.entryPrice}`);
    } else if (position) {
      const price = candle.close;
      const pnl = position.side === 'long'
        ? ((price - position.entryPrice) / position.entryPrice) * position.leverage
        : ((position.entryPrice - price) / position.entryPrice) * position.leverage;

      if (Math.abs(pnl) >= 0.01) {
        capital *= 1 + pnl;
        console.log(`[청산] ${position.side} @ ${price} → PNL: ${(pnl * 100).toFixed(2)}%`);
        pnl > 0 ? win++ : loss++;
        await logSimResult({
          time: candle.timestamp,
          side: position.side,
          pnl: pnl,
          capital,
        });
        position = null;
      }
    }
  }

  const endPrice = (simData as Candle[]).at(-1)?.close;
  console.log(`[종가]: ${endPrice}`);
  console.log(`[자본]: ${capital}`);
  console.log(`[승]: ${win}`);
  console.log(`[패]: ${loss}`);
}
