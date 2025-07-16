const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 인증 토큰 (앱과 공유하는 비밀값, 환경변수로도 설정 가능)
const AUTH_SECRET = process.env.AUTH_SECRET || 'my_secret_token';

// Bitget 기본 URL
const BITGET_BASE_URL = 'https://api.bitget.com';

// 기본 라우트
app.get('/', (req, res) => {
  res.send('✅ Bitget Secure API Server is Running');
});

// Bitget 연결 테스트 및 API 호출
app.post('/bitget-test', async (req, res) => {
  const { apiKey, apiSecret, apiPassphrase, auth } = req.body;

  // 인증 체크
  if (auth !== AUTH_SECRET) {
    return res.status(403).json({ error: '인증 실패: 유효하지 않은 접근' });
  }

  if (!apiKey || !apiSecret || !apiPassphrase) {
    return res.status(400).json({ error: 'API 정보가 누락되었습니다.' });
  }

  const timestamp = new Date().toISOString();
  const method = 'GET';
  const endpoint = '/api/spot/v1/account/assets';
  const body = '';

  // Bitget 서명 생성
  const preHash = timestamp + method + endpoint + body;
  const hmac = crypto.createHmac('sha256', apiSecret);
  const signature = hmac.update(preHash).digest('base64');

  try {
    const response = await axios.get(BITGET_BASE_URL + endpoint, {
      headers: {
        'ACCESS-KEY': apiKey,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': apiPassphrase,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Bitget API 오류:', error.response?.data || error.message);
    res.status(500).json({ error: 'Bitget API 호출 실패', detail: error.response?.data });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Bitget 보안 서버 실행 중 (포트 ${PORT})`);
});