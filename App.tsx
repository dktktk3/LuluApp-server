import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { ConnectionProvider } from './components/ConnectionContext';
import BitgetWebSocket from './components/BitgetWebSocket';
import PollingManager from './components/PollingManager';
import ConnectionStatus from './components/ConnectionStatus';

import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [tradingStarted, setTradingStarted] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [passphrase, setPassphrase] = useState('');

  useEffect(() => {
    async function loadKeys() {
      const storedApiKey = await SecureStore.getItemAsync('apiKey');
      const storedSecretKey = await SecureStore.getItemAsync('secretKey');
      const storedPassphrase = await SecureStore.getItemAsync('passphrase');
      if (storedApiKey) setApiKey(storedApiKey);
      if (storedSecretKey) setSecretKey(storedSecretKey);
      if (storedPassphrase) setPassphrase(storedPassphrase);
    }
    loadKeys();
  }, []);

  const startTrading = () => {
    if (!apiKey || !secretKey || !passphrase) {
      alert('API 키, 비밀키, 패스프레이즈를 모두 입력해야 합니다.');
      return;
    }
    setTradingStarted(true);
  };

  const stopTrading = () => {
    setTradingStarted(false);
  };

  return (
    <ConnectionProvider>
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Button title="거래 시작" onPress={startTrading} disabled={tradingStarted} />
          <Button title="거래 종료" onPress={stopTrading} disabled={!tradingStarted} />
        </View>

        <ConnectionStatus />

        {tradingStarted && <BitgetWebSocket />}
        {tradingStarted && <PollingManager />}

        <ScrollView style={styles.scrollView}>
          <Dashboard />
          <SettingsModal />
        </ScrollView>
      </View>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  scrollView: { flex: 1 },
});











