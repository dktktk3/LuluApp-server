import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { useConnection } from './ConnectionContext';

export default function BitgetWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const { setIsConnected } = useConnection();

  useEffect(() => {
    function connect() {
      ws.current = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket 연결됨');
        const subscribeMsg = JSON.stringify({
          op: 'subscribe',
          args: [{ channel: 'futures/depth', symbol: 'BTCUSDT_UMCBL' }],
        });
        ws.current?.send(subscribeMsg);
      };

      ws.current.onmessage = (event) => {
        console.log('수신 메시지:', event.data);
      };

      ws.current.onclose = (e) => {
        setIsConnected(false);
        console.log('WebSocket 연결 종료', e.reason);
        setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket 에러:', error);
        ws.current?.close();
      };
    }

    connect();

    return () => {
      ws.current?.close();
    };
  }, [setIsConnected]);

  return <Text>WebSocket 상태 유지 중...</Text>;
}


