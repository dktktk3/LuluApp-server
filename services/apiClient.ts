import crypto from 'crypto-js';

const BASE_URL = 'https://api.bitget.com';

export function getTimestamp(): string {
  return Date.now().toString();
}

export function signRequest(
  timestamp: string,
  method: string,
  requestPath: string,
  body: string,
  secretKey: string
): string {
  const message = timestamp + method.toUpperCase() + requestPath + body;
  return crypto.HmacSHA256(message, secretKey).toString(crypto.enc.Base64);
}

export async function apiRequest(
  apiKey: string,
  secretKey: string,
  passphrase: string,
  method: 'GET' | 'POST',
  requestPath: string,
  body: any = null
) {
  const timestamp = getTimestamp();
  const bodyString = body ? JSON.stringify(body) : '';
  const signature = signRequest(timestamp, method, requestPath, bodyString, secretKey);

  const headers: Record<string, string> = {
    'ACCESS-KEY': apiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': passphrase,
  };

  if (method === 'POST') headers['Content-Type'] = 'application/json';

  const response = await fetch(BASE_URL + requestPath, {
    method,
    headers,
    body: method === 'POST' ? bodyString : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

