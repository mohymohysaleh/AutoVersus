import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  ComparisonCar,
  ComparisonScope,
  MetricCategory,
} from '../types/comparison.types';
import {
  COMPARISON_CARS_DATABASE,
  METRIC_DEFINITIONS,
  generateAiVerdict,
} from '../data/comparison-mock.data';

import { StickyHeader } from '../components/StickyHeader';
import { AiDecisionBanner } from '../components/AiDecisionBanner';
import { CustomPromptModal } from '../components/CustomPromptModal';
import { ComparisonScopeSelector } from '../components/ComparisonScopeSelector';
import { MetricRow } from '../components/MetricRow';
import { CarPickerModal } from '../components/CarPickerModal';

export const ComparisonScreen: React.FC = () => {
  // Active selected cars (default 2 cars: Toyota Corolla Comfort vs Hyundai Elantra Smart)
  const [selectedCars, setSelectedCars] = useState<ComparisonCar[]>([
    COMPARISON_CARS_DATABASE[0], // Toyota Corolla 2026 Comfort
    COMPARISON_CARS_DATABASE[1], // Hyundai Elantra 2026 Smart
  ]);

  // Active comparison scope: 'Full' | 'Overview' | 'Specs' | 'Safety' | 'Features'
  const [activeScope, setActiveScope] = useState<ComparisonScope>('Full');

  // Custom user prompt state
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Modals state
  const [isPromptModalVisible, setIsPromptModalVisible] = useState<boolean>(false);
  const [isCarPickerVisible, setIsCarPickerVisible] = useState<boolean>(false);
  const [activeSlotToSwap, setActiveSlotToSwap] = useState<number | null>(null);

  // Dynamic AI Verdict computation
  const aiVerdict = useMemo(() => {
    return generateAiVerdict(selectedCars, customPrompt);
  }, [selectedCars, customPrompt]);

  // Filtered metrics based on active scope selector
  const filteredMetrics = useMemo(() => {
    if (activeScope === 'Full') {
      return METRIC_DEFINITIONS;
    }
    return METRIC_DEFINITIONS.filter((m) => m.category === (activeScope as MetricCategory));
  }, [activeScope]);

  // Group metrics by Category & GroupTitle for crisp section cards
  const groupedMetrics = useMemo(() => {
    const map = new Map<string, typeof filteredMetrics>();
    filteredMetrics.forEach((m) => {
      const key = m.groupTitle || m.category.toUpperCase();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(m);
    });
    return Array.from(map.entries());
  }, [filteredMetrics]);

  // Handlers
  const handleAddCar = () => {
    setActiveSlotToSwap(null);
    setIsCarPickerVisible(true);
  };

  const handleSwapCar = (index: number) => {
    setActiveSlotToSwap(index);
    setIsCarPickerVisible(true);
  };

  const handleRemoveCar = (index: number) => {
    if (selectedCars.length > 2) {
      const updated = selectedCars.filter((_, i) => i !== index);
      setSelectedCars(updated);
    }
  };

  const handleSelectCarFromPicker = (car: ComparisonCar) => {
    if (activeSlotToSwap !== null) {
      // Swap existing slot
      const updated = [...selectedCars];
      updated[activeSlotToSwap] = car;
      setSelectedCars(updated);
    } else {
      // Add as 3rd car slot
      if (selectedCars.length < 3) {
        setSelectedCars([...selectedCars, car]);
      }
    }
    setActiveSlotToSwap(null);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/search');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconCircleBtn} onPress={handleBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={20} color="#0F3040" />
        </TouchableOpacity>

        <View style={styles.navTitleGroup}>
          <Text style={styles.navTitle}>AutoVersus Spec Battle</Text>
          <Text style={styles.navSubTitle}>Live AI Decision Matrix</Text>
        </View>

        <TouchableOpacity
          style={styles.iconCircleBtn}
          onPress={() => setIsPromptModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color="#0F3040" />
        </TouchableOpacity>
      </View>

      {/* Sticky 2-Column or 3-Column Header */}
      <StickyHeader
        cars={selectedCars}
        onAddCarPress={handleAddCar}
        onSwapCarPress={handleSwapCar}
        onRemoveCarPress={handleRemoveCar}
      />

      {/* Scrollable Content Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* AI Smart Decision Banner */}
        <AiDecisionBanner
          verdict={aiVerdict}
          onPersonalizePress={() => setIsPromptModalVisible(true)}
        />

        {/* Custom Prompt Input Bar */}
        <View style={styles.promptBarWrapper}>
          <TouchableOpacity
            style={styles.promptBarCard}
            onPress={() => setIsPromptModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.promptIconCircle}>
              <Ionicons name="create-outline" size={16} color="#0F3040" />
            </View>
            <View style={styles.promptTextContainer}>
              <Text style={styles.promptLabel}>
                {customPrompt ? 'Custom Driver Priority Active' : 'Add Custom Comparison Prompt'}
              </Text>
              <Text style={styles.promptSubText} numberOfLines={1}>
                {customPrompt
                  ? `"${customPrompt}"`
                  : 'e.g. "I want the car best suited for a gentle daily Cairo commuter..."'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Comparison Scope Filter Selector */}
        <ComparisonScopeSelector
          activeScope={activeScope}
          onSelectScope={setActiveScope}
        />

        {/* Metric Cards Grouped by Section */}
        <View style={styles.metricsContainer}>
          {groupedMetrics.map(([groupTitle, metrics]) => (
            <View key={groupTitle} style={styles.metricCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>{groupTitle}</Text>
              </View>

              {metrics.map((metric, index) => (
                <MetricRow
                  key={metric.id}
                  metric={metric}
                  cars={selectedCars}
                  isOddRow={index % 2 === 1}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Dealership Quote CTA */}
        <View style={styles.bottomCtaWrapper}>
          <TouchableOpacity style={styles.quoteButton} activeOpacity={0.85}>
            <Text style={styles.quoteButtonText}>Request Official Dealer Quotes</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <CustomPromptModal
        visible={isPromptModalVisible}
        currentPrompt={customPrompt}
        onClose={() => setIsPromptModalVisible(false)}
        onApplyPrompt={setCustomPrompt}
      />

      <CarPickerModal
        visible={isCarPickerVisible}
        availableCars={COMPARISON_CARS_DATABASE}
        selectedCarIds={selectedCars.map((c) => c.id)}
        onClose={() => setIsCarPickerVisible(false)}
        onSelectCar={handleSelectCarFromPicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navTitleGroup: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3040',
  },
  navSubTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  scrollBody: {
    paddingBottom: 40,
  },
  promptBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  promptBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  promptIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 48, 64, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTextContainer: {
    flex: 1,
  },
  promptLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F3040',
  },
  promptSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  metricCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C4342B',
    letterSpacing: 1,
  },
  bottomCtaWrapper: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  quoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F3040',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quoteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
