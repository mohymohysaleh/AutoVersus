import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AiVerdictData } from '../types/comparison.types';

interface AiDecisionBannerProps {
  verdict: AiVerdictData;
  isLoading?: boolean;
  onPersonalizePress: () => void;
}

export const AiDecisionBanner: React.FC<AiDecisionBannerProps> = ({
  verdict,
  isLoading = false,
  onPersonalizePress,
}) => {
  if (isLoading) {
    return (
      <View style={styles.bannerContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#38BDF8" />
          <Text style={styles.loadingText}>Grok AI is evaluating vehicle specs & driver priority...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bannerContainer}>
      {/* Top AI Engine Tag */}
      <View style={styles.engineTagRow}>
        <Ionicons name="hardware-chip" size={12} color="#38BDF8" />
        <Text style={styles.engineTagText}>
          {verdict.aiEngine || 'Powered by Grok AI Engine (openai/gpt-oss-120b)'}
        </Text>
      </View>

      {/* Banner Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={18} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{verdict.title || 'AutoVersus AI Verdict'}</Text>
            {verdict.winnerName && (
              <Text style={styles.winnerSubTag}>Selected by Grok AI Real-Time Analysis</Text>
            )}
          </View>
        </View>

        {/* Applied Prompt Pill Badge */}
        {verdict.promptApplied && (
          <View style={styles.promptActiveBadge}>
            <Ionicons name="sparkles" size={12} color="#F59E0B" />
            <Text style={styles.promptActiveText}>Custom Priority</Text>
          </View>
        )}
      </View>

      {/* Reason Header & Text */}
      <View style={styles.reasonBox}>
        <View style={styles.reasonLabelRow}>
          <Ionicons name="bulb" size={14} color="#F59E0B" />
          <Text style={styles.reasonLabel}>GROK AI VERDICT & RATIONALE</Text>
        </View>
        <Text style={styles.summaryText}>{verdict.summary}</Text>

        {/* Key Advantages List */}
        {Array.isArray(verdict.keyAdvantages) && verdict.keyAdvantages.length > 0 && (
          <View style={styles.advantagesContainer}>
            <Text style={styles.advantagesHeader}>KEY DECISION FACTORS:</Text>
            {verdict.keyAdvantages.map((adv, idx) => (
              <View key={idx} style={styles.advantageRow}>
                <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                <Text style={styles.advantageText}>{adv}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Footer Row with Quick Action */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.personalizePillButton}
          onPress={onPersonalizePress}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={14} color="#FFFFFF" />
          <Text style={styles.personalizeText}>Customize Driver Priority</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#0F2942',
    borderWidth: 1.5,
    borderColor: '#1E495E',
    borderTopColor: '#F59E0B',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 14,
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  engineTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  engineTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  winnerSubTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  promptActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  promptActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reasonBox: {
    backgroundColor: '#163A4E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  reasonLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#F1F5F9',
    fontWeight: '500',
  },
  advantagesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  advantagesHeader: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  advantageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  advantageText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
    flex: 1,
    lineHeight: 19,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  personalizePillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  personalizeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

