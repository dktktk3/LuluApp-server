import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  visible: boolean;
  message: string;
}

export default function NotificationToast({ visible, message }: Props) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 3000);
      });
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  message: {
    color: '#fff',
    fontWeight: '600',
  },
});
