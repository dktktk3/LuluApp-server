import React, { useEffect, useState } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { useConnection } from './ConnectionContext';

export default function ConnectionStatus() {
  const { isConnected } = useConnection();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (isConnected === null) {
      setStatus('connecting');
    } else if (isConnected) {
      setStatus('connected');
    } else {
      setStatus('disconnected');
    }
  }, [isConnected]);

  useEffect(() => {
    if (status === 'connecting') {
      const fadeInOut = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      fadeInOut.start();
      return () => fadeInOut.stop();
    } else {
      fadeAnim.setValue(1);
    }
  }, [status]);

  let displayText = '';
  let textStyle = styles.defaultText;

  switch (status) {
    case 'connecting':
      displayText = '연결 시도중...';
      textStyle = styles.connecting;
      break;
    case 'connected':
      displayText = '연결됨';
      textStyle = styles.connected;
      break;
    case 'disconnected':
      displayText = '끊김';
      textStyle = styles.disconnected;
      break;
  }

  return (
    <Animated.Text style={[textStyle, { opacity: fadeAnim }]}>
      거래소 연결: {displayText}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 16,
  },
  connecting: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  connected: {
    color: '#008000',
    fontWeight: 'bold',
  },
  disconnected: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

