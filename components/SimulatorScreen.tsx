import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { runSimulation } from '../services/SimulatorEngine';

interface Summary {
  startPrice?: number;
  endPrice?: number;
  capital?: number;
  win?: number;
  loss?: number;
}

export default function SimulatorScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setLogs(['[시뮬레이터 시작]']);
    const logCollector: string[] = [];

    const originalLog = console.log;
    console.log = (msg: any) => {
      if (typeof msg === 'string') {
        logCollector.push(msg);

        if (msg.startsWith('[시작가]')) summary.startPrice = Number(msg.split(':')[1]);
        if (msg.startsWith('[종가]')) summary.endPrice = Number(msg.split(':')[1]);
        if (msg.startsWith('[자본]')) summary.capital = Number(msg.split(':')[1]);
        if (msg.startsWith('[승]')) summary.win = Number(msg.split(':')[1]);
        if (msg.startsWith('[패]')) summary.loss = Number(msg.split(':')[1]);
      }
    };

    await runSimulation();

    console.log = originalLog;
    setLogs([...logs, ...logCollector]);
    setSummary({ ...summary });
    setRunning(false);
  };

  const calcTotalYield = () => {
    if (summary.capital && summary.startPrice)
      return (((summary.capital - 1000) / 1000) * 100).toFixed(2);
    return '0.00';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 시뮬레이터</Text>
      <TouchableOpacity
        style={[styles.button, running && styles.disabled]}
        onPress={handleRun}
        disabled={running}
      >
        <Text style={styles.buttonText}>{running ? '실행 중...' : '시뮬레이션 시작'}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.logBox}>
        {logs.map((log, idx) => (
          <Text key={idx} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>

      <View style={styles.summary}>
        <Text style={styles.sumText}>📈 시작가: {summary.startPrice || '-'} / 종가: {summary.endPrice || '-'}</Text>
        <Text style={styles.sumText}>💰 최종 자본: {summary.capital?.toFixed(2) || '-'}</Text>
        <Text style={styles.sumText}>📊 총 수익률: {calcTotalYield()}%</Text>
        <Text style={styles.sumText}>승: {summary.win || 0} / 패: {summary.loss || 0}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  button: {
    backgroundColor: '#60a5fa', padding: 12, borderRadius: 8, marginBottom: 16, alignItems: 'center'
  },
  disabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logBox: { maxHeight: 300, marginTop: 12 },
  logText: { fontSize: 12, color: '#333', marginBottom: 4 },
  summary: { marginTop: 12, padding: 10, backgroundColor: '#f9fafb', borderRadius: 8 },
  sumText: { fontSize: 14, marginBottom: 4 }
});

