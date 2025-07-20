import * as SecureStore from 'expo-secure-store';

export async function loadAPIKeys() {
  const apiKey = await SecureStore.getItemAsync('API_KEY') || '';
  const apiSecret = await SecureStore.getItemAsync('API_SECRET') || '';
  const passphrase = await SecureStore.getItemAsync('API_PASSPHRASE') || '';
  return { apiKey, apiSecret, passphrase };
}

export async function saveAPIKeys(keys: { apiKey: string; apiSecret: string; passphrase: string }) {
  await SecureStore.setItemAsync('API_KEY', keys.apiKey);
  await SecureStore.setItemAsync('API_SECRET', keys.apiSecret);
  await SecureStore.setItemAsync('API_PASSPHRASE', keys.passphrase);
}

