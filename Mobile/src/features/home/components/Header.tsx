import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      {/* Brand Logo replacing Motory */}
      <Image
        source={require('../../../../assets/images/avLogo-removebg-preview.png')}
        style={styles.logo}
        resizeMode="cover"
      />

      {/* Right Action Icons */}
      <View style={styles.rightContainer}>
        {/* Language Switcher Pill */}
        <TouchableOpacity style={styles.langPill} onPress={onLanguageToggle} activeOpacity={0.7}>
          <Ionicons name="language-outline" size={16} color="#374151" />
          <Text style={styles.langText}>{currentLang}</Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color="#1F2937" />
          <View style={styles.notificationDot} />
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
    gap: 10,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  notificationButton: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
