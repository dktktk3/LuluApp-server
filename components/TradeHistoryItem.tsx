import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  date: string;
  profit: string;
  entries: number;
  wins: number;
  losses: number;
}

export default function TradeHistoryItem({ date, profit, entries, wins, losses }: Props) {
  return (
    <View style={styles.container}>
      <Text>📅 {date}</Text>
      <Text>수익률: {profit}</Text>
      <Text>거래 횟수: {entries}회 (승 {wins} / 패 {losses})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, borderBottomWidth: 1, borderColor: '#e5e7eb' },
});
