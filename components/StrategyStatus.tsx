import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StrategyStatus() {
  // 현재 전략 및 AI 모델 상태 표시
  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>전략 상태: 정상 작동 중</Text>
      <Text style={styles.statusText}>AI 모델: 최신 버전 적용됨</Text>
      <Text style={styles.statusText}>거래소 연결: 안정적</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    marginVertical: 2,
  },
});

