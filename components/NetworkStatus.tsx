import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  connected: boolean;
}

export default function NetworkStatus({ connected }: Props) {
  return (
    <View style={[styles.container, connected ? styles.online : styles.offline]}>
      <Text style={styles.text}>
        {connected ? '📶 연결 중' : '📴 네트워크 끊김 감지'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 5,
  },
  online: {
    backgroundColor: '#4ade80',
  },
  offline: {
    backgroundColor: '#f87171',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
