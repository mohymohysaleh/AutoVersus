import { AuthValidationErrors, RegisterUserDto, LoginUserDto } from '../types/auth.types';

/**
 * Validates RFC standard email syntax.
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. name@domain.com).';
  }
  return undefined;
};

/**
 * Validates password rules (minimum 8 characters, at least one letter and one number).
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return 'Password must contain at least one letter and one number.';
  }
  return undefined;
};

/**
 * Validates user full name.
 */
export const validateFullName = (name: string): string | undefined => {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  return undefined;
};

/**
 * Validates optional Egyptian mobile phone number (01[0125]XXXXXXXX).
 */
export const validatePhone = (phone: string): string | undefined => {
  if (!phone || !phone.trim()) {
    return undefined; // Phone is optional
  }
  const cleanPhone = phone.replace(/\s+/g, '');
  const egPhoneRegex = /^(\+20|0)?1[0125]\d{8}$/;
  if (!egPhoneRegex.test(cleanPhone)) {
    return 'Please enter a valid Egyptian mobile number (e.g. 01012345678).';
  }
  return undefined;
};

/**
 * Validates entire Sign Up registration payload.
 */
export const validateRegistrationForm = (
  dto: RegisterUserDto,
  confirmPassword?: string,
  agreeTerms?: boolean
): { isValid: boolean; errors: AuthValidationErrors } => {
  const errors: AuthValidationErrors = {};

  const nameErr = validateFullName(dto.name || '');
  if (nameErr) errors.fullName = nameErr;

  const emailErr = validateEmail(dto.email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(dto.phone || '');
  if (phoneErr) errors.phone = phoneErr;

  const passErr = validatePassword(dto.password);
  if (passErr) errors.password = passErr;

  if (confirmPassword !== undefined && dto.password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (agreeTerms === false) {
    errors.terms = 'You must accept the Terms of Service to continue.';
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

/**
 * Validates Sign In credentials payload.
 */
export const validateLoginForm = (
  dto: LoginUserDto
): { isValid: boolean; errors: AuthValidationErrors } => {
  const errors: AuthValidationErrors = {};

  const emailErr = validateEmail(dto.email);
  if (emailErr) errors.email = emailErr;

  if (!dto.password) {
    errors.password = 'Password is required.';
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};
