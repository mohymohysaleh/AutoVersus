import { apiClient } from '../../../shared/services/api-client';
import {
  RegisterUserDto,
  LoginUserDto,
  GoogleAuthDto,
  AuthResponseData,
  UserProfile,
  AuthTokens,
  ApiResponse,
} from '../types/auth.types';

export const authApi = {
  /**
   * Register a new user account
   */
  async register(dto: RegisterUserDto): Promise<AuthResponseData> {
    const response = (await apiClient.post('/v1/auth/register', dto)) as unknown as ApiResponse<AuthResponseData>;
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Registration failed.');
    }
    return response.data;
  },

  /**
   * Authenticate user credentials and return JWT tokens + profile
   */
  async login(dto: LoginUserDto): Promise<AuthResponseData> {
    const response = (await apiClient.post('/v1/auth/login', dto)) as unknown as ApiResponse<AuthResponseData>;
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Invalid email or password.');
    }
    return response.data;
  },

  /**
   * Authenticate or provision account via Google OAuth
   */
  async googleLogin(dto: GoogleAuthDto): Promise<AuthResponseData> {
    const response = (await apiClient.post('/v1/auth/google', dto)) as unknown as ApiResponse<AuthResponseData>;
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Google authentication failed.');
    }
    return response.data;
  },

  /**
   * Fetch currently authenticated user's profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = (await apiClient.get('/v1/auth/me')) as unknown as ApiResponse<UserProfile>;
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to retrieve profile.');
    }
    return response.data;
  },

  /**
   * Refresh JWT access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = (await apiClient.post('/v1/auth/refresh', {
      refreshToken,
    })) as unknown as ApiResponse<{ tokens: AuthTokens }>;
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Session expired. Please sign in again.');
    }
    return response.data.tokens;
  },

  /**
   * Update user preferences (currency, language, metric system)
   */
  async updatePreferences(preferences: {
    preferredCurrency?: string;
    preferredLang?: 'EN' | 'AR';
    measurementSystem?: 'METRIC' | 'IMPERIAL';
  }): Promise<UserProfile> {
    const response = (await apiClient.patch(
      '/v1/auth/preferences',
      preferences
    )) as unknown as ApiResponse<UserProfile>;
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update preferences.');
    }
    return response.data;
  },
};
