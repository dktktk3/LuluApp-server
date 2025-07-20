import { useEffect, useState } from 'react';
import { getAIScore } from '../ai/Predictor';

export function useSignalWatcher(symbols: string[], intervalMs: number = 15000) {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function fetchScores() {
      const newScores: Record<string, number> = {};
      for (const symbol of symbols) {
        const score = await getAIScore(symbol);
        newScores[symbol] = score;
      }
      setScores(newScores);
    }

    fetchScores();
    timer = setInterval(fetchScores, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [symbols, intervalMs]);

  return scores;
}