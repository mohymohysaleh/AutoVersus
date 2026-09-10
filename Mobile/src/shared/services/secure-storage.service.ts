import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AuthTokens, UserProfile } from '../../features/identity/types/auth.types';

const ACCESS_TOKEN_KEY = 'autoversus_sec_access_token';
const REFRESH_TOKEN_KEY = 'autoversus_sec_refresh_token';
const USER_PROFILE_KEY = 'autoversus_sec_user_profile';

// In-memory cache for ultra-fast synchronous header generation
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let cachedUserProfile: UserProfile | null = null;

class SecureStorageService {
  /**
   * Save authentication tokens to Android EncryptedSharedPreferences / KeyStore
   */
  async saveTokens(tokens: AuthTokens): Promise<void> {
    cachedAccessToken = tokens.accessToken;
    cachedRefreshToken = tokens.refreshToken;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      return;
    }

    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.warn('⚠️ EncryptedSharedPreferences error while saving tokens:', error);
    }
  }

  /**
   * Get Access Token (Synchronous cache read or Async KeyStore fetch)
   */
  getAccessTokenSync(): string | null {
    return cachedAccessToken;
  }

  async getAccessToken(): Promise<string | null> {
    if (cachedAccessToken) return cachedAccessToken;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        cachedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      }
      return cachedAccessToken;
    }

    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      cachedAccessToken = token;
      return token;
    } catch (error) {
      console.warn('⚠️ EncryptedSharedPreferences error reading access token:', error);
      return null;
    }
  }

  /**
   * Get Refresh Token
   */
  async getRefreshToken(): Promise<string | null> {
    if (cachedRefreshToken) return cachedRefreshToken;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        cachedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      }
      return cachedRefreshToken;
    }

    try {
      const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      cachedRefreshToken = token;
      return token;
    } catch (error) {
      console.warn('⚠️ EncryptedSharedPreferences error reading refresh token:', error);
      return null;
    }
  }

  /**
   * Save User Profile payload securely encrypted
   */
  async saveUserProfile(user: UserProfile): Promise<void> {
    cachedUserProfile = user;
    const jsonStr = JSON.stringify(user);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_PROFILE_KEY, jsonStr);
      }
      return;
    }

    try {
      await SecureStore.setItemAsync(USER_PROFILE_KEY, jsonStr, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.warn('⚠️ EncryptedSharedPreferences error saving user profile:', error);
    }
  }

  /**
   * Read User Profile payload from EncryptedSharedPreferences
   */
  async getUserProfile(): Promise<UserProfile | null> {
    if (cachedUserProfile) return cachedUserProfile;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(USER_PROFILE_KEY);
        if (raw) {
          try {
            cachedUserProfile = JSON.parse(raw);
          } catch {
            cachedUserProfile = null;
          }
        }
      }
      return cachedUserProfile;
    }

    try {
      const raw = await SecureStore.getItemAsync(USER_PROFILE_KEY);
      if (raw) {
        cachedUserProfile = JSON.parse(raw);
        return cachedUserProfile;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ EncryptedSharedPreferences error reading user profile:', error);
      return null;
    }
  }

  /**
   * Purge all tokens and sensitive profile data upon Logout
   */
  async clearAll(): Promise<void> {
    cachedAccessToken = null;
    cachedRefreshToken = null;
    cachedUserProfile = null;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
      }
      return;
    }

    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
    } catch (error) {
      console.warn('⚠️ EncryptedSharedPreferences error clearing tokens:', error);
    }
  }
}

export const secureStorageService = new SecureStorageService();
