import { Role, Language, MeasurementSystem } from '@prisma/client';

export interface RegisterUserDto {
  email: string;
  password: string;
  name?: string;
  country?: string;
  preferredCurrency?: string;
  preferredLang?: Language;
  measurementSystem?: MeasurementSystem;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
}

export interface UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: Role;
  country: string;
  preferredCurrency: string;
  preferredLang: Language;
  measurementSystem: MeasurementSystem;
  createdAt?: string;
}

export interface UpdatePreferencesDto {
  preferredCurrency?: string;
  preferredLang?: Language;
  measurementSystem?: MeasurementSystem;
}
