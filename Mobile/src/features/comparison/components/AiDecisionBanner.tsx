import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AiVerdictData } from '../types/comparison.types';

interface AiDecisionBannerProps {
  verdict: AiVerdictData;
  onPersonalizePress: () => void;
}

export const AiDecisionBanner: React.FC<AiDecisionBannerProps> = ({
  verdict,
  onPersonalizePress,
}) => {
  return (
    <View style={styles.bannerContainer}>
      {/* Banner Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={16} color="#0F3040" />
          </View>
          <Text style={styles.bannerTitle}>{verdict.title || 'AutoVersus AI Verdict'}</Text>
        </View>

        {/* Applied Prompt Pill Badge */}
        {verdict.promptApplied && (
          <View style={styles.promptActiveBadge}>
            <Ionicons name="options" size={12} color="#0F3040" />
            <Text style={styles.promptActiveText}>Custom Weight</Text>
          </View>
        )}
      </View>

      {/* Banner Verdict Text */}
      <Text style={styles.summaryText}>{verdict.summary}</Text>

      {/* Footer Row with Quick Action */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.personalizePillButton}
          onPress={onPersonalizePress}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={14} color="#0F3040" />
          <Text style={styles.personalizeText}>Personalize Priority</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: 'rgba(15, 48, 64, 0.05)',
    borderWidth: 1,
    borderColor: '#0F3040',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 48, 64, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3040',
    letterSpacing: 0.2,
  },
  promptActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 48, 64, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  promptActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F3040',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  personalizePillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0F3040',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  personalizeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3040',
  },
});
