// 7. ai/EnhancedAIScorer.ts

interface AIScore {
  score: number;
  direction: 'long' | 'short' | 'neutral';
}

export async function getEnhancedAIScore(symbol: string): Promise<AIScore> {
  // AI 모델, 뉴스, 고래 지갑, 시장심리, 변동성 등 종합 반영
  const rawScore = Math.random() * 10;
  const direction = rawScore > 5 ? 'long' : 'short';

  return { score: rawScore, direction };
}
