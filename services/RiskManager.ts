// 5. services/RiskManager.ts

import { getCurrentPosition, exitPosition } from './tradeService';
import { getEnhancedAIScore } from '../ai/EnhancedAIScorer';
import { sendPushNotification } from './notificationService';

const MAX_STOPLOSS_PERCENT = 15;
const TRAILING_STOP_PERCENT = 0.4;

export async function manageRiskWithTrailingStop(
  symbol: string,
  entryPrice: number,
  leverage: number
): Promise<void> {
  const position = await getCurrentPosition(symbol);
  if (!position) return;

  const currentPrice = await getCurrentMarketPrice(symbol);
  if (!currentPrice) return;

  const lossPercent = ((entryPrice - currentPrice) / entryPrice) * 100 * leverage;
  if (lossPercent > MAX_STOPLOSS_PERCENT) {
    await exitPosition(symbol);
    await sendPushNotification('손절 청산', `${symbol} 최대 손실 초과 청산`);
    return;
  }

  const aiScore = await getEnhancedAIScore(symbol);

  if (
    (position.direction === 'long' && aiScore.direction === 'short') ||
    (position.direction === 'short' && aiScore.direction === 'long')
  ) {
    await exitPosition(symbol);
    await sendPushNotification('자동 청산', `${symbol} AI 반대 신호 청산`);
    return;
  }

  const trailingStopPrice = calculateTrailingStopPrice(entryPrice, currentPrice, TRAILING_STOP_PERCENT);

  if (
    (position.direction === 'long' && currentPrice <= trailingStopPrice) ||
    (position.direction === 'short' && currentPrice >= trailingStopPrice)
  ) {
    await exitPosition(symbol);
    await sendPushNotification('트레일링 손절 청산', `${symbol} 트레일링 스탑 도달 청산`);
  }
}

function calculateTrailingStopPrice(
  entryPrice: number,
  currentPrice: number,
  trailingPercent: number
): number {
  const profitPercent = (currentPrice - entryPrice) / entryPrice;
  if (profitPercent <= 0) return entryPrice * (1 - 0.033);
  return currentPrice * (1 - trailingPercent);
}

async function getCurrentMarketPrice(symbol: string): Promise<number | null> {
  try {
    // 실제 API 연동 필요
    return 30000;
  } catch (error) {
    console.error('마켓 가격 조회 실패:', error);
    return null;
  }
}

