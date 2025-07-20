import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TradeButton from './TradeButton';
import StrategyStatus from './StrategyStatus';
import HistoryReport from './HistoryReport';
import SettingsModal from './SettingsModal';

interface Props {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  apiKeys: { apiKey: string; apiSecret: string; passphrase: string };
  modelLoading: boolean;
}

import logo from '../assets/logo.png'; // 이미지 경로는 프로젝트 구조에 맞게 조정

export default function Dashboard({ running, onStart, onStop, apiKeys, modelLoading }: Props) {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Ai.Lullu</Text>
      <StrategyStatus />
      <TradeButton running={running} onStart={onStart} onStop={onStop} />
      <HistoryReport />
      <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
        <Text style={styles.settingsText}>⚙️ 설정</Text>
      </TouchableOpacity>
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSave={() => {
          setSettingsVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  logo: { width: 150, height: 50, resizeMode: 'contain', alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  settingsButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  settingsText: { fontSize: 18 },
});



