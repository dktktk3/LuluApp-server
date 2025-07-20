import { apiRequest } from './apiClient';

export async function getLiquidationPrice(symbol: string): Promise<number> {
  const position = await apiRequest('GET', `/api/mix/v1/position/singlePosition?symbol=${symbol}`);
  return position.liquidationPrice || 0;
}

export async function enforceSafetyStopLoss(
  symbol: string,
  currentStopLoss: number
): Promise<number> {
  const liqPrice = await getLiquidationPrice(symbol);
  return currentStopLoss > liqPrice ? currentStopLoss : liqPrice * 1.01;
}