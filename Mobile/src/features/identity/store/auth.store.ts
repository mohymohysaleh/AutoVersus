import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import {
  UserProfile,
  AuthTokens,
  RegisterUserDto,
  LoginUserDto,
  GoogleAuthDto,
} from '../types/auth.types';
import { secureStorageService } from '../../../shared/services/secure-storage.service';
import { useSavedStore } from '../../profile/store/saved.store';

export const tokenStorage = {
  getAccessToken(): string | null {
    return secureStorageService.getAccessTokenSync();
  },

  async getAccessTokenAsync(): Promise<string | null> {
    return secureStorageService.getAccessToken();
  },

  async getRefreshToken(): Promise<string | null> {
    return secureStorageService.getRefreshToken();
  },

  async setTokens(tokens: AuthTokens) {
    await secureStorageService.saveTokens(tokens);
  },

  async clearTokens() {
    await secureStorageService.clearAll();
  },
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  // Actions
  login: (dto: LoginUserDto) => Promise<void>;
  register: (dto: RegisterUserDto) => Promise<void>;
  loginWithGoogle: (dto: GoogleAuthDto) => Promise<void>;
  logout: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (dto: LoginUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(dto);
      await tokenStorage.setTokens(data.tokens);
      const userProfile: UserProfile = { ...data.user, authProvider: 'LOCAL' };
      await secureStorageService.saveUserProfile(userProfile);
      await useSavedStore.getState().loadSavedForUser(userProfile.id);
      set({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
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
      await tokenStorage.setTokens(data.tokens);
      const userProfile: UserProfile = { ...data.user, authProvider: 'LOCAL' };
      await secureStorageService.saveUserProfile(userProfile);
      await useSavedStore.getState().loadSavedForUser(userProfile.id);
      set({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
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

  loginWithGoogle: async (dto: GoogleAuthDto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.googleLogin(dto);
      await tokenStorage.setTokens(data.tokens);
      const userProfile: UserProfile = { ...data.user, authProvider: 'GOOGLE' };
      await secureStorageService.saveUserProfile(userProfile);
      await useSavedStore.getState().loadSavedForUser(userProfile.id);
      set({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Google Sign-In failed. Please try again.',
      });
      throw err;
    }
  },

  logout: async () => {
    await tokenStorage.clearTokens();
    await useSavedStore.getState().loadSavedForUser('guest');
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: false,
      error: null,
    });
  },

  loadUserProfile: async () => {
    const token = await secureStorageService.getAccessToken();
    const cachedUser = await secureStorageService.getUserProfile();

    if (!token && !cachedUser) {
      await useSavedStore.getState().loadSavedForUser('guest');
      set({ isLoading: false, isAuthenticated: false, user: null, isInitializing: false });
      return;
    }

    // Set cached user immediately for instant zero-latency UI session restoration
    if (cachedUser) {
      await useSavedStore.getState().loadSavedForUser(cachedUser.id);
      set({ user: cachedUser, isAuthenticated: true, isLoading: false, isInitializing: false });
    } else {
      set({ isLoading: true });
    }

    if (!token) {
      set({ isInitializing: false });
      return;
    }

    try {
      const user = await authApi.getProfile();
      await secureStorageService.saveUserProfile(user);
      await useSavedStore.getState().loadSavedForUser(user.id);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
      });
    } catch (err: any) {
      // Only perform secure logout if profile fetch fails due to explicit 401 Unauthorized
      if (err?.status === 401 || err?.response?.status === 401) {
        await tokenStorage.clearTokens();
        await useSavedStore.getState().loadSavedForUser('guest');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitializing: false,
        });
      } else {
        // Network error or backend offline - preserve cached user session
        set({ isLoading: false, isInitializing: false });
      }
    }
  },

  clearError: () => set({ error: null }),
}));
