export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  country: string;
  preferredCurrency: string;
  preferredLang: 'EN' | 'AR';
  measurementSystem: 'METRIC' | 'IMPERIAL';
  authProvider?: 'LOCAL' | 'GOOGLE';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}

export interface RegisterUserDto {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  country?: string;
  preferredCurrency?: string;
  preferredLang?: 'EN' | 'AR';
  measurementSystem?: 'METRIC' | 'IMPERIAL';
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface GoogleAuthDto {
  email: string;
  name?: string;
  idToken?: string;
  avatarUrl?: string;
}

export interface AuthValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}
