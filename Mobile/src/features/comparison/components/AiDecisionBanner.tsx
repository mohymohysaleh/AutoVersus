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
          <ActivityIndicator size="small" color="#0F3040" />
          <Text style={styles.loadingText}>Grok AI is evaluating vehicle specs & drivers priority...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bannerContainer}>
      {/* Top AI Engine Tag */}
      <View style={styles.engineTagRow}>
        <Ionicons name="hardware-chip-outline" size={12} color="#0F3040" />
        <Text style={styles.engineTagText}>
          {verdict.aiEngine || 'Powered by Grok AI Engine (llama-3.3-70b-versatile)'}
        </Text>
      </View>

      {/* Banner Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={16} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{verdict.title || 'AutoVersus AI Verdict'}</Text>
            {verdict.winnerName && (
              <Text style={styles.winnerSubTag}>Selected by Grok AI Analysis</Text>
            )}
          </View>
        </View>

        {/* Applied Prompt Pill Badge */}
        {verdict.promptApplied && (
          <View style={styles.promptActiveBadge}>
            <Ionicons name="sparkles" size={12} color="#0F3040" />
            <Text style={styles.promptActiveText}>Custom Priority</Text>
          </View>
        )}
      </View>

      {/* Reason Header & Text */}
      <View style={styles.reasonBox}>
        <View style={styles.reasonLabelRow}>
          <Ionicons name="bulb-outline" size={14} color="#0F3040" />
          <Text style={styles.reasonLabel}>GROK AI VERDICT & RATIONALE</Text>
        </View>
        <Text style={styles.summaryText}>{verdict.summary}</Text>

        {/* Key Advantages List */}
        {Array.isArray(verdict.keyAdvantages) && verdict.keyAdvantages.length > 0 && (
          <View style={styles.advantagesContainer}>
            <Text style={styles.advantagesHeader}>KEY DECISION FACTORS:</Text>
            {verdict.keyAdvantages.map((adv, idx) => (
              <View key={idx} style={styles.advantageRow}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
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
          <Ionicons name="options-outline" size={14} color="#0F3040" />
          <Text style={styles.personalizeText}>Change Driver Priority</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F3040',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 14,
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  engineTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    backgroundColor: 'rgba(15, 48, 64, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  engineTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F3040',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F3040',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F3040',
    letterSpacing: 0.2,
  },
  winnerSubTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  promptActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 48, 64, 0.1)',
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
  reasonBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  reasonLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F3040',
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#1E293B',
    fontWeight: '500',
  },
  advantagesContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  advantagesHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  advantageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  advantageText: {
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
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
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  personalizeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3040',
  },
});

