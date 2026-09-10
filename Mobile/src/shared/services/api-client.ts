import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { secureStorageService } from './secure-storage.service';

// Dynamic host IP resolution for Expo Go / Emulators
const hostUri = Constants.expoConfig?.hostUri;
const devHostIp = hostUri ? hostUri.split(':')[0] : (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const DEFAULT_URL = `http://${devHostIp}:5000/api`;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || DEFAULT_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Bearer Token from EncryptedSharedPreferences
apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = secureStorageService.getAccessTokenSync();
    if (!accessToken) {
      accessToken = await secureStorageService.getAccessToken();
    }
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    const customError = new Error(message) as any;
    customError.status = error.response?.status;
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

