import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../store/auth.store';
import {
  validateRegistrationForm,
  validateLoginForm,
} from '../utils/auth.validation';
import { AuthValidationErrors } from '../types/auth.types';

export const AuthScreen: React.FC = () => {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(
    params.mode === 'signup' ? 'signup' : 'signin'
  );

  // Store
  const { login, register, isLoading, error: apiError, clearError } = useAuthStore();

  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI & Validation Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [validationErrors, setValidationErrors] = useState<AuthValidationErrors>({});

  const handleTabChange = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setValidationErrors({});
    clearError();
  };

  const handleSignInSubmit = async () => {
    clearError();
    const { isValid, errors } = validateLoginForm({ email, password });
    setValidationErrors(errors);

    if (!isValid) return;

    try {
      await login({ email: email.trim(), password });
      router.replace('/');
    } catch (err) {
      // API error handled by store state
    }
  };

  const handleSignUpSubmit = async () => {
    clearError();
    const dto = {
      email: email.trim(),
      password,
      name: fullName.trim(),
      phone: phone.trim(),
      country: 'EG',
      preferredCurrency: 'EGP',
      preferredLang: 'EN' as const,
      measurementSystem: 'METRIC' as const,
    };

    const { isValid, errors } = validateRegistrationForm(dto, confirmPassword, agreeTerms);
    setValidationErrors(errors);

    if (!isValid) return;

    try {
      await register(dto);
      router.replace('/');
    } catch (err) {
      // API error handled by store state
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView nativeID="auth-screen-container" testID="auth-screen-container" style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar with Logo & Close Button */}
      <View nativeID="auth-top-bar" testID="auth-top-bar" style={styles.topBar}>
        <Image
          nativeID="auth-logo-image"
          testID="auth-logo-image"
          source={require('../../../../assets/images/avLogo-removebg-preview.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          testID="auth-close-button"
          accessibilityLabel="Close Authentication Screen"
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Title Header */}
        <View nativeID="auth-title-header" testID="auth-title-header" style={styles.titleHeader}>
          <Text style={styles.tagline}>AUTOMOTIVE PLATFORM</Text>
          <Text style={styles.headline}>
            {activeTab === 'signin' ? 'Sign In to AutoVersus' : 'Create Your Account'}
          </Text>
          <Text style={styles.subHeadline}>
            {activeTab === 'signin'
              ? 'Access your saved garage, market price alerts, and custom spec comparisons.'
              : 'Join Egypt’s automotive spec comparison and market intelligence platform.'}
          </Text>
        </View>

        {/* Global API Error Alert Banner */}
        {apiError && (
          <View nativeID="auth-api-error-banner" testID="auth-api-error-banner" style={styles.apiErrorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
            <Text style={styles.apiErrorText}>{apiError}</Text>
          </View>
        )}

        {/* Tab Switcher Bar */}
        <View nativeID="auth-tab-bar" testID="auth-tab-bar" style={styles.tabBar}>
          <TouchableOpacity
            testID="auth-tab-signin"
            accessibilityLabel="Switch to Sign In"
            style={[styles.tabButton, activeTab === 'signin' && styles.tabButtonActive]}
            onPress={() => handleTabChange('signin')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'signin' && styles.tabTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="auth-tab-signup"
            accessibilityLabel="Switch to Sign Up"
            style={[styles.tabButton, activeTab === 'signup' && styles.tabButtonActive]}
            onPress={() => handleTabChange('signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* SIGN IN FORM */}
        {activeTab === 'signin' && (
          <View nativeID="auth-signin-form" testID="auth-signin-form" style={styles.formContainer}>
            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, validationErrors.email && styles.inputWrapperError]}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  nativeID="auth-signin-email-input"
                  testID="auth-signin-email-input"
                  accessibilityLabel="Email Address"
                  style={styles.textInput}
                  placeholder="name@domain.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {validationErrors.email && <Text style={styles.fieldErrorText}>{validationErrors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, validationErrors.password && styles.inputWrapperError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  nativeID="auth-signin-password-input"
                  testID="auth-signin-password-input"
                  accessibilityLabel="Password"
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <TouchableOpacity
                  testID="auth-signin-password-toggle"
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {validationErrors.password && <Text style={styles.fieldErrorText}>{validationErrors.password}</Text>}
            </View>

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                testID="auth-remember-me-checkbox"
                style={styles.checkboxRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity testID="auth-forgot-password-button" activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Primary CTA */}
            <TouchableOpacity
              testID="auth-signin-submit-button"
              accessibilityLabel="Submit Sign In"
              style={styles.primaryButtonNavy}
              onPress={handleSignInSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH GUEST ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Continue as Guest */}
            <TouchableOpacity
              testID="auth-guest-button"
              accessibilityLabel="Explore as Guest"
              style={styles.googleButton}
              onPress={handleClose}
              activeOpacity={0.85}
            >
              <Ionicons name="compass-outline" size={20} color="#0F2942" style={{ marginRight: 8 }} />
              <Text style={styles.googleButtonText}>Explore Catalog as Guest</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          <View nativeID="auth-signup-form" testID="auth-signup-form" style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputWrapper, validationErrors.fullName && styles.inputWrapperError]}>
                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  nativeID="auth-signup-fullname-input"
                  testID="auth-signup-fullname-input"
                  accessibilityLabel="Full Name"
                  style={styles.textInput}
                  placeholder="e.g. Ahmed Hassan"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (validationErrors.fullName) setValidationErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                />
              </View>
              {validationErrors.fullName && <Text style={styles.fieldErrorText}>{validationErrors.fullName}</Text>}
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, validationErrors.email && styles.inputWrapperError]}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  nativeID="auth-signup-email-input"
                  testID="auth-signup-email-input"
                  accessibilityLabel="Email Address"
                  style={styles.textInput}
                  placeholder="name@domain.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {validationErrors.email && <Text style={styles.fieldErrorText}>{validationErrors.email}</Text>}
            </View>

            {/* Mobile Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Phone (Optional)</Text>
              <View style={[styles.phoneWrapper, validationErrors.phone && styles.inputWrapperError]}>
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.countryCodeText}>🇪🇬 +20</Text>
                </View>
                <TextInput
                  nativeID="auth-signup-phone-input"
                  testID="auth-signup-phone-input"
                  accessibilityLabel="Mobile Phone"
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="100 123 4567"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (validationErrors.phone) setValidationErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  keyboardType="phone-pad"
                />
              </View>
              {validationErrors.phone && <Text style={styles.fieldErrorText}>{validationErrors.phone}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, validationErrors.password && styles.inputWrapperError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  nativeID="auth-signup-password-input"
                  testID="auth-signup-password-input"
                  accessibilityLabel="Password"
                  style={styles.textInput}
                  placeholder="At least 8 characters (letters & numbers)"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <TouchableOpacity
                  testID="auth-signup-password-toggle"
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {validationErrors.password && <Text style={styles.fieldErrorText}>{validationErrors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputWrapper, validationErrors.confirmPassword && styles.inputWrapperError]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  nativeID="auth-signup-confirmpassword-input"
                  testID="auth-signup-confirmpassword-input"
                  accessibilityLabel="Confirm Password"
                  style={styles.textInput}
                  placeholder="Re-enter password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (validationErrors.confirmPassword) setValidationErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                />
              </View>
              {validationErrors.confirmPassword && <Text style={styles.fieldErrorText}>{validationErrors.confirmPassword}</Text>}
            </View>

            {/* Agree Terms Checkbox */}
            <TouchableOpacity
              testID="auth-terms-checkbox"
              style={styles.checkboxRow}
              onPress={() => {
                setAgreeTerms(!agreeTerms);
                if (validationErrors.terms) setValidationErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to AutoVersus <Text style={styles.termsHighlight}>Terms of Service</Text> &{' '}
                <Text style={styles.termsHighlight}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {validationErrors.terms && <Text style={styles.fieldErrorText}>{validationErrors.terms}</Text>}

            {/* Create Account Red CTA */}
            <TouchableOpacity
              testID="auth-signup-submit-button"
              accessibilityLabel="Submit Create Account"
              style={styles.primaryButtonRed}
              onPress={handleSignUpSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH GUEST ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Continue as Guest */}
            <TouchableOpacity
              testID="auth-guest-button"
              accessibilityLabel="Explore as Guest"
              style={styles.googleButton}
              onPress={handleClose}
              activeOpacity={0.85}
            >
              <Ionicons name="compass-outline" size={20} color="#0F2942" style={{ marginRight: 8 }} />
              <Text style={styles.googleButtonText}>Explore Catalog as Guest</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  logoImage: {
    width: 140,
    height: 40,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  titleHeader: {
    marginBottom: 16,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F2942',
    marginBottom: 8,
  },
  subHeadline: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  apiErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
    gap: 8,
  },
  apiErrorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#0F2942',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryCodeBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F2942',
  },
  eyeIcon: {
    padding: 4,
  },
  fieldErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 2,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C92A2A',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  termsHighlight: {
    fontWeight: '700',
    color: '#0F2942',
  },
  primaryButtonNavy: {
    backgroundColor: '#0F2942',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonRed: {
    backgroundColor: '#C92A2A',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 24,
  },
  googleButtonText: {
    color: '#0F2942',
    fontSize: 15,
    fontWeight: '700',
  },
});
