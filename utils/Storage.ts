import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToStorage(key: string, value: any) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Storage save error for key: ${key}`, error);
  }
}

export async function getFromStorage(key: string) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Storage get error for key: ${key}`, error);
    return null;
  }
}