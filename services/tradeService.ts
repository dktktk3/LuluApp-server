// 9. services/tradeService.ts (최신 업로드 파일 반영)

import axios from 'axios';
import crypto from 'crypto';

interface ApiKeys {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}

let storedKeys: ApiKeys | null = null;

export function setApiKeys(keys: ApiKeys) {
  storedKeys = keys;
}

function getAuthHeaders(method: string, endpoint: string, body = '') {
  if (!storedKeys) throw new Error('API 키가 설정되지 않았습니다.');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const prehash = timestamp + method.toUpperCase() + endpoint + body;
  const hmac = crypto.createHmac('sha256', storedKeys.apiSecret);
  const signature = hmac.update(prehash).digest('base64');

  return {
    'ACCESS-KEY': storedKeys.apiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': storedKeys.passphrase,
    'Content-Type': 'application/json',
  };
}

export async function enterPosition(
  symbol: string,
  direction: 'long' | 'short',
  leverage: number,
  stopLossPercent: number,
  takeProfitPrice?: number
) {
  const endpoint = '/api/mix/v1/order/place-order';
  const body = JSON.stringify({
    symbol,
    marginCoin: 'USDT',
    size: 1,
    price: null,
    leverage,
    side: direction === 'long' ? 'buy' : 'sell',
    category: 1,
    stopLossPrice: stopLossPercent, // 실제 값 변환 필요
    takeProfitPrice: takeProfitPrice || null,
    orderType: 1,
  });

  const headers = getAuthHeaders('POST', endpoint, body);

  try {
    const response = await axios.post(`https://api.bitget.com${endpoint}`, body, { headers });
    return response.data;
  } catch (error) {
    console.error('진입 주문 실패:', error);
    throw error;
  }
}

export async function exitPosition(symbol: string) {
  const endpoint = '/api/mix/v1/order/close-position';
  const body = JSON.stringify({ symbol, marginCoin: 'USDT' });
  const headers = getAuthHeaders('POST', endpoint, body);

  try {
    const response = await axios.post(`https://api.bitget.com${endpoint}`, body, { headers });
    return response.data;
  } catch (error) {
    console.error('청산 주문 실패:', error);
    throw error;
  }
}

export async function getCurrentPosition(symbol: string) {
  const endpoint = `/api/mix/v1/position/singlePosition?symbol=${symbol}&marginCoin=USDT`;
  const headers = getAuthHeaders('GET', endpoint);

  try {
    const response = await axios.get(`https://api.bitget.com${endpoint}`, { headers });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('현재 포지션 조회 실패:', error);
    return null;
  }
}
