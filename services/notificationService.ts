import * as Notifications from 'expo-notifications';

export async function sendPushNotification(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // 즉시 알림
    });
  } catch (error) {
    console.error('푸시 알림 실패:', error);
  }
}