import React, { useEffect } from 'react';
import { useConnection } from './ConnectionContext';

// 실제 API 호출 함수로 교체 필요
function fetchAccountStatus() {
  return fetch('https://api.bitget.com/api/account/v1/wallet', {
    method: 'GET',
    headers: {
      'ACCESS-KEY': 'your_api_key',
      'ACCESS-SIGN': 'signature',
      'ACCESS-TIMESTAMP': 'timestamp',
      'ACCESS-PASSPHRASE': 'passphrase',
    },
  }).then((res) => res.json());
}

export default function PollingManager() {
  const { setIsConnected } = useConnection();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAccountStatus()
        .then(() => setIsConnected(true))
        .catch(() => setIsConnected(false));
    }, 30000);

    return () => clearInterval(interval);
  }, [setIsConnected]);

  return null;
}

