// ai/Predictor.ts

import { fetchRecentTrades, fetchPriceHistory, fetchVolumeHistory } from './DataCollector';

interface Trade {
  amount: number;
  price: number;
  timestamp: number;
}

interface AIScoreRecord {
  timestamp: number;
  score: number;
}

// 1. 고래 체결 감지
function detectWhaleActivity(trades: Trade[]): boolean {
  const largeTrades = trades.filter(t => t.amount >= 50);
  return largeTrades.length >= 3;
}

// 2. 급등락 (스파이크) 감지
function detectSpike(currentPrice: number, pastPrice: number): boolean {
  const changePercent = ((currentPrice - pastPrice) / pastPrice) * 100;
  return Math.abs(changePercent) >= 1.5;
}

// 3. 체결량 급증 감지
function detectVolumeSurge(currentVolume: number, pastVolume: number): boolean {
  if (pastVolume === 0) return false;
  return currentVolume / pastVolume >= 5;
}

// 4. AI 점수 급변 감지
function detectAIScoreSpike(history: AIScoreRecord[]): boolean {
  if (history.length < 2) return false;
  const prev = history[history.length - 2].score;
  const current = history[history.length - 1].score;
  return Math.abs(current - prev) >= 2;
}

// 종합 AI 점수 계산
export async function getAIScore(symbol: string): Promise<number> {
  try {
    const trades = await fetchRecentTrades(symbol);
    const prices = await fetchPriceHistory(symbol, 60); // 1분봉
    const volumes = await fetchVolumeHistory(symbol, 10); // 10초봉

    if (prices.length < 2 || volumes.length < 2) return 0;

    const whaleDetected = detectWhaleActivity(trades);
    const spikeDetected = detectSpike(prices[prices.length - 1], prices[prices.length - 2]);
    const volumeSurge = detectVolumeSurge(volumes[volumes.length - 1], volumes[volumes.length - 2]);

    let score = 0;
    if (whaleDetected) score += 3;
    if (spikeDetected) score += 2;
    if (volumeSurge) score += 1;

    // TODO: AI 점수 기록 히스토리와 연동 필요
    const aiHistory: AIScoreRecord[] = []; 
    if (detectAIScoreSpike(aiHistory)) {
      score += 3;
    }

    return Math.min(score, 10);
  } catch (error) {
    console.error('AI 점수 계산 실패:', error);
    return 0;
  }
}
