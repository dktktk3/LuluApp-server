// 3. components/SettingsModal.tsx

import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (keys: { apiKey: string; apiSecret: string; passphrase: string }) => void;
}

export default function SettingsModal({ visible, onClose, onSave }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [passphrase, setPassphrase] = useState('');

  useEffect(() => {
    async function loadKeys() {
      const savedApiKey = await SecureStore.getItemAsync('API_KEY');
      const savedApiSecret = await SecureStore.getItemAsync('API_SECRET');
      const savedPassphrase = await SecureStore.getItemAsync('API_PASSPHRASE');
      if (savedApiKey) setApiKey(savedApiKey);
      if (savedApiSecret) setApiSecret(savedApiSecret);
      if (savedPassphrase) setPassphrase(savedPassphrase);
    }
    if (visible) {
      loadKeys();
    }
  }, [visible]);

  const handleSave = async () => {
    if (!apiKey.trim() || !apiSecret.trim() || !passphrase.trim()) {
      Alert.alert('입력 오류', '모든 필드를 정확히 입력해주세요.');
      return;
    }
    try {
      await SecureStore.setItemAsync('API_KEY', apiKey);
      await SecureStore.setItemAsync('API_SECRET', apiSecret);
      await SecureStore.setItemAsync('API_PASSPHRASE', passphrase);
      Alert.alert('저장 완료', 'API 정보가 안전하게 저장되었습니다.');
      onSave({ apiKey, apiSecret, passphrase });
      onClose();
    } catch (error) {
      Alert.alert('저장 실패', 'API 정보 저장 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>API 설정</Text>
          <TextInput
            placeholder="API Key"
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="API Secret"
            style={styles.input}
            value={apiSecret}
            onChangeText={setApiSecret}
            secureTextEntry
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Passphrase"
            style={styles.input}
            value={passphrase}
            onChangeText={setPassphrase}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={styles.buttons}>
            <Button title="저장" onPress={handleSave} />
            <Button title="닫기" onPress={onClose} color="#ef4444" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
});



