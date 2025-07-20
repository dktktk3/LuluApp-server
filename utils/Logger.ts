import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_KEY = 'app_logs';

export async function addLog(message: string) {
  try {
    const existingLogsJson = await AsyncStorage.getItem(LOG_KEY);
    const logs = existingLogsJson ? JSON.parse(existingLogsJson) : [];
    const newLog = { timestamp: new Date().toISOString(), message };
    logs.unshift(newLog);
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('로그 저장 실패:', error);
  }
}

export async function getLogs() {
  try {
    const logsJson = await AsyncStorage.getItem(LOG_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (error) {
    console.error('로그 불러오기 실패:', error);
    return [];
  }
}