// 10. components/TradeButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function TradeButton({ running, onStart, onStop }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, running ? styles.stopButton : styles.startButton]}
      onPress={running ? onStop : onStart}
    >
      <Text style={styles.text}>{running ? '자동매매 중지' : '자동매매 시작'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
