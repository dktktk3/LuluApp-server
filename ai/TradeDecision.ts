// 8. ai/TradeDecision.ts

import { enterPosition, exitPosition, getCurrentPosition } from '../services/tradeService';
import { getEnhancedAIScore } from './EnhancedAIScorer';

export async function evaluateTrade(symbol: string) {
  const aiScore = await getEnhancedAIScore(symbol);
  const position = await getCurrentPosition(symbol);

  if (!position) {
    if (aiScore.score >= 3) {
      const direction = aiScore.direction;
      await enterPosition(symbol, direction, 1, 10, undefined);
      console.log(`진입: ${symbol} ${direction}`);
    }
  } else {
    if (
      (position.direction === 'long' && aiScore.direction === 'short') ||
      (position.direction === 'short' && aiScore.direction === 'long')
    ) {
      await exitPosition(symbol);
      console.log(`청산: ${symbol}`);
    }
  }
}

