import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface TradeHistoryItem {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  entryTime: string;
  exitTime?: string;
  profitPercent?: number;
  result?: 'win' | 'loss' | 'pending';
}

interface HistoryReportProps {
  history?: TradeHistoryItem[];
}

const dummyHistory: TradeHistoryItem[] = [
  {
    id: '1',
    symbol: 'BTCUSDT',
    entryPrice: 30000,
    exitPrice: 31000,
    entryTime: '2025-07-19 14:00',
    exitTime: '2025-07-19 15:00',
    profitPercent: 3.33,
    result: 'win',
  },
  {
    id: '2',
    symbol: 'ETHUSDT',
    entryPrice: 2000,
    exitPrice: 1950,
    entryTime: '2025-07-19 13:30',
    exitTime: '2025-07-19 14:10',
    profitPercent: -2.5,
    result: 'loss',
  },
];

export default function HistoryReport({ history = dummyHistory }: HistoryReportProps) {
  const renderItem = ({ item }: { item: TradeHistoryItem }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.detail}>진입가: {item.entryPrice.toFixed(2)}</Text>
        <Text style={styles.detail}>
          청산가: {item.exitPrice ? item.exitPrice.toFixed(2) : '진행 중'}
        </Text>
        <Text style={styles.detail}>진입 시간: {item.entryTime}</Text>
        <Text style={styles.detail}>
          청산 시간: {item.exitTime ? item.exitTime : '진행 중'}
        </Text>
        <Text
          style={[
            styles.profit,
            item.profitPercent && item.profitPercent > 0
              ? styles.win
              : styles.loss,
          ]}
        >
          수익률: {item.profitPercent ? item.profitPercent.toFixed(2) : '0'}%
        </Text>
        <Text style={styles.result}>
          결과: {item.result ? item.result.toUpperCase() : '진행 중'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>거래 히스토리</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>거래 기록이 없습니다.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  item: {
    backgroundColor: '#f9fafb',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  symbol: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  detail: { fontSize: 14, color: '#374151' },
  profit: { fontSize: 14, fontWeight: 'bold', marginTop: 6 },
  win: { color: '#16a34a' }, // 초록
  loss: { color: '#dc2626' }, // 빨강
  result: { fontSize: 14, marginTop: 4, color: '#6b7280' },
  emptyText: { textAlign: 'center', color: '#9ca3af', fontSize: 16, marginTop: 20 },
});
