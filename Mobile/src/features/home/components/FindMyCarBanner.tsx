import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FindMyCarBannerProps {
  onQuizPress?: () => void;
}

export const FindMyCarBanner: React.FC<FindMyCarBannerProps> = ({ onQuizPress }) => {
  return (
    <View nativeID="home-quiz-banner-container" testID="home-quiz-banner-container" style={styles.container}>
      {/* Left Content Area */}
      <View nativeID="home-quiz-banner-content" testID="home-quiz-banner-content" style={styles.contentLeft}>
        {/* Header Tag */}
        <View style={styles.tagRow}>
          <Ionicons name="sparkles-outline" size={14} color="#FFFFFF" />
          <Text style={styles.tagText}>FIND MY CAR</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Not sure which car fits your lifestyle?
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Answer a few quick questions. We'll find your match.
        </Text>

        {/* CTA Quiz Button */}
        <TouchableOpacity
          testID="home-take-quiz-button"
          accessibilityLabel="Take 2-Min Lifestyle Spec Quiz"
          style={styles.quizButton}
          onPress={onQuizPress}
          activeOpacity={0.85}
        >
          <Text style={styles.quizButtonText}>Take 2-Min Quiz</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Right Circle Graphic */}
      <View nativeID="home-quiz-banner-graphic" style={styles.graphicCircle}>
        <Ionicons name="car-outline" size={42} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: '#0A2540', // Rich dark navy blue from screenshot
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  contentLeft: {
    flex: 1,
    paddingRight: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD', // Light accent blue
    letterSpacing: 1,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 20,
  },
  quizButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C92A2A', // Vibrant red button from screenshot
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  graphicCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
