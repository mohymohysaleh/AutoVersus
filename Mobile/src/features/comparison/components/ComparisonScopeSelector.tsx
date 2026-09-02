import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonScope } from '../types/comparison.types';

interface ComparisonScopeSelectorProps {
  activeScope: ComparisonScope;
  onSelectScope: (scope: ComparisonScope) => void;
}

const SCOPES: { id: ComparisonScope; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'Full', label: 'Full Comparison', icon: 'grid-outline' },
  { id: 'Overview', label: 'Overview', icon: 'eye-outline' },
  { id: 'Specs', label: 'Specs', icon: 'speedometer-outline' },
  { id: 'Safety', label: 'Safety', icon: 'shield-checkmark-outline' },
  { id: 'Features', label: 'Features', icon: 'sparkles-outline' },
];

export const ComparisonScopeSelector: React.FC<ComparisonScopeSelectorProps> = ({
  activeScope,
  onSelectScope,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {SCOPES.map((item) => {
          const isActive = activeScope === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelectScope(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.icon}
                size={15}
                color={isActive ? '#FFFFFF' : '#0F3040'}
              />
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  pillActive: {
    backgroundColor: '#0F3040',
    borderColor: '#0F3040',
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
