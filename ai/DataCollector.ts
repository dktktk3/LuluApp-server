import axios from 'axios';

export async function fetchNewsSentiment(symbol: string): Promise<number> {
  try {
    const response = await axios.get(`https://newsapi.example.com/sentiment?symbol=${symbol}`);
    return response.data.score || 0;
  } catch (error) {
    console.error('뉴스 감성 분석 실패:', error);
    return 0;
  }
}

export async function fetchWhaleActivity(symbol: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://whaleapi.example.com/activity?symbol=${symbol}`);
    return response.data.largeTradesDetected || false;
  } catch (error) {
    console.error('고래 활동 감지 실패:', error);
    return false;
  }
}

export async function fetchChartData(symbol: string) {
  try {
    const response = await axios.get(`https://chartapi.example.com/candles?symbol=${symbol}&interval=1m`);
    return response.data;
  } catch (error) {
    console.error('차트 데이터 수집 실패:', error);
    return null;
  }
}