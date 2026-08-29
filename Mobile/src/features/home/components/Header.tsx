import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface HeaderProps {
  onNotificationPress?: () => void;
  onLanguageToggle?: () => void;
  currentLang?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationPress,
  onLanguageToggle,
  currentLang = 'EN',
}) => {
  return (
    <View style={styles.container}>
      {/* Brand Logo - Pressing opens Onboarding Tour */}
      <TouchableOpacity onPress={() => router.push('/onboarding')} activeOpacity={0.8}>
        <Image
          source={require('../../../../assets/images/avLogo-removebg-preview.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Right Action Icons */}
      <View style={styles.rightContainer}>
        {/* Onboarding Tour Badge */}
        <TouchableOpacity
          style={styles.tourPill}
          onPress={() => router.push('/onboarding')}
          activeOpacity={0.7}
        >
          <Ionicons name="compass-outline" size={16} color="#0F2942" />
          <Text style={styles.tourText}>Tour</Text>
        </TouchableOpacity>

        {/* Language Switcher Pill */}
        <TouchableOpacity style={styles.langPill} onPress={onLanguageToggle} activeOpacity={0.7}>
          <Ionicons name="language-outline" size={16} color="#374151" />
          <Text style={styles.langText}>{currentLang}</Text>
        </TouchableOpacity>

        {/* Auth / Sign In Button */}
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push('/auth')}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={24} color="#0F2942" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 140,
    height: 38,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tourPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  tourText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F2942',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  authButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
