import { create } from 'zustand';
import { Platform } from 'react-native';
import { authApi } from '../api/auth.api';
import {
  UserProfile,
  AuthTokens,
  RegisterUserDto,
  LoginUserDto,
} from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'autoversus_access_token';
const REFRESH_TOKEN_KEY = 'autoversus_refresh_token';

// In-memory token cache for fast access
let currentAccessToken: string | null = null;
let currentRefreshToken: string | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    if (currentAccessToken) return currentAccessToken;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      currentAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return currentAccessToken;
  },

  getRefreshToken(): string | null {
    if (currentRefreshToken) return currentRefreshToken;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return currentRefreshToken;
  },

  setTokens(tokens: AuthTokens) {
    currentAccessToken = tokens.accessToken;
    currentRefreshToken = tokens.refreshToken;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },

  clearTokens() {
    currentAccessToken = null;
    currentRefreshToken = null;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (dto: LoginUserDto) => Promise<void>;
  register: (dto: RegisterUserDto) => Promise<void>;
  logout: () => void;
  loadUserProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (dto: LoginUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(dto);
      tokenStorage.setTokens(data.tokens);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Failed to sign in. Please try again.',
      });
      throw err;
    }
  },

  register: async (dto: RegisterUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.register(dto);
      tokenStorage.setTokens(data.tokens);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Registration failed. Please try again.',
      });
      throw err;
    }
  },

  logout: () => {
    tokenStorage.clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUserProfile: async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authApi.getProfile();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      // Token might be invalid or expired
      tokenStorage.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
