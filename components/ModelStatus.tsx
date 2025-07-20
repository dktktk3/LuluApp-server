import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  loading: boolean;
  error?: string | null;
}

export default function ModelStatus({ loading, error }: Props) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="small" color="#2563eb" />}
      <Text style={[styles.text, error ? styles.errorText : null]}>
        {error ? `모델 오류: ${error}` : loading ? '모델 로딩 중...' : '모델 준비 완료'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, alignItems: 'center' },
  text: { fontSize: 14, color: '#374151' },
  errorText: { color: '#dc2626' },
});
