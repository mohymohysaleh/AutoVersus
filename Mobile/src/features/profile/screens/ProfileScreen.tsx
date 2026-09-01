import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SavedVehiclesTab } from '../components/SavedVehiclesTab';
import { SavedComparisonsTab } from '../components/SavedComparisonsTab';
import { AccountSettingsTab } from '../components/AccountSettingsTab';
import { useAuthStore } from '../../identity/store/auth.store';
import { useLanguage } from '../../../shared/context/LanguageContext';

export const ProfileScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'saved' | 'comparisons' | 'account'>('saved');

  const isEn = language === 'EN';

  const handleCreateAccount = () => {
    router.push({
      pathname: '/auth',
      params: { mode: 'signup' },
    });
  };

  const handleSignIn = () => {
    router.push({
      pathname: '/auth',
      params: { mode: 'signin' },
    });
  };

  // =========================================================================
  // GUEST STATE VIEW (When user is not signed in)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <SafeAreaView nativeID="profile-guest-screen-container" testID="profile-guest-screen-container" style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.collectionLabel}>{isEn ? 'GUEST MODE' : 'وضع الزائر'}</Text>
            <Text style={styles.mainTitle}>{isEn ? 'My Garage & Account' : 'كراجي وحسابي'}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleSignIn} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={18} color="#0F2942" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.guestContentContainer}>
          {/* Guest Hero Card */}
          <View nativeID="profile-guest-hero-card" testID="profile-guest-hero-card" style={styles.guestHeroCard}>
            <View style={styles.guestIconCircle}>
              <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.guestHeadline}>{isEn ? 'Unlock Your Personal Garage' : 'افتح كراجك الشخصي'}</Text>
            <Text style={styles.guestSubtitle}>
              {isEn
                ? 'You are exploring AutoVersus as a guest. Sign in or create an account to save your favorite car specs, receive live Egyptian market price drop alerts, and compare vehicles side-by-side.'
                : 'أنت تتصفح أوتو فيرسس كزائر. سجل الدخول أو أنشئ حساباً لحفظ مواصفات سياراتك المفضلة، وتلقي تنبيهات أسعار السوق المصري، ومقارنة السيارات جنبًا إلى جنب.'}
            </Text>

            {/* Benefit Checklist */}
            <View style={styles.benefitChecklist}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#93C5FD" />
                <Text style={styles.benefitText}>{isEn ? 'Save favorite car trims & specs' : 'حفظ فئات ومواصفات السيارات المفضلة'}</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#93C5FD" />
                <Text style={styles.benefitText}>{isEn ? 'Track live agency MSRP price shifts' : 'متابعة تغيرات أسعار الوكيل والسوق'}</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#93C5FD" />
                <Text style={styles.benefitText}>{isEn ? 'Store custom vehicle matchups' : 'حفظ مقارنات السيارات الخاصة بك'}</Text>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.guestActionStack}>
            <TouchableOpacity
              testID="profile-guest-create-account-btn"
              accessibilityLabel="Create Account"
              style={styles.guestRedButton}
              onPress={handleCreateAccount}
              activeOpacity={0.85}
            >
              <Text style={styles.guestRedButtonText}>{isEn ? 'Create an Account' : 'إنشاء حساب جديد'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="profile-guest-signin-btn"
              accessibilityLabel="Sign In"
              style={styles.guestNavyButton}
              onPress={handleSignIn}
              activeOpacity={0.85}
            >
              <Text style={styles.guestNavyButtonText}>{isEn ? 'Sign In to Existing Account' : 'تسجيل الدخول لحسابك'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // AUTHENTICATED STATE VIEW
  // =========================================================================
  return (
    <SafeAreaView nativeID="profile-auth-screen-container" testID="profile-auth-screen-container" style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.collectionLabel}>{isEn ? 'WELCOME BACK' : 'مرحباً بك'}</Text>
          <Text style={styles.mainTitle}>{user?.name || (isEn ? 'My Garage' : 'كراجي')}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={18} color="#0F2942" />
        </TouchableOpacity>
      </View>

      {/* 3-Tab Pill Switcher Bar */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'saved' && styles.tabPillActive]}
          onPress={() => setActiveTab('saved')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
            {isEn ? 'Saved' : 'المحفوظات'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'comparisons' && styles.tabPillActive]}
          onPress={() => setActiveTab('comparisons')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'comparisons' && styles.tabTextActive]}>
            {isEn ? 'Comparisons' : 'المقارنات'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'account' && styles.tabPillActive]}
          onPress={() => setActiveTab('account')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'account' && styles.tabTextActive]}>
            {isEn ? 'Account' : 'إعدادات الحساب'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab View Content Body */}
      <View style={styles.tabContent}>
        {activeTab === 'saved' && <SavedVehiclesTab />}
        {activeTab === 'comparisons' && <SavedComparisonsTab />}
        {activeTab === 'account' && <AccountSettingsTab />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  collectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1,
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F2942',
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: '#0F2942',
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
  },

  /* Guest Mode Styles */
  guestContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 20,
  },
  guestHeroCard: {
    backgroundColor: '#0F2942',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  guestIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guestHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitChecklist: {
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guestActionStack: {
    gap: 12,
  },
  guestRedButton: {
    height: 52,
    backgroundColor: '#C92A2A',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C92A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  guestRedButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  guestNavyButton: {
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestNavyButtonText: {
    color: '#0F2942',
    fontSize: 15,
    fontWeight: '700',
  },
});
