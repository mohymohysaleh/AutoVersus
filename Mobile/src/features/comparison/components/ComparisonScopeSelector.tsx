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
                color={isActive ? '#F59E0B' : '#0F2942'}
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
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
  },
  pillActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  pillTextActive: {
    color: '#F59E0B',
    fontWeight: '800',
  },
});
