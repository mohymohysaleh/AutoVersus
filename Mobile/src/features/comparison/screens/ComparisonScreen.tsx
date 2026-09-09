import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import {
  ComparisonCar,
  ComparisonScope,
  MetricCategory,
  AiVerdictData,
} from '../types/comparison.types';
import {
  COMPARISON_CARS_DATABASE,
  METRIC_DEFINITIONS,
  generateAiVerdict,
} from '../data/comparison-mock.data';
import { fetchGrokComparisonVerdict } from '../services/comparison-api.service';
import { catalogApi } from '../../catalog/api/catalog.api';
import { mapVariantToComparisonCar } from '../../../shared/utils/comparison-mapper';
import { useAuthStore } from '../../identity/store/auth.store';
import { useSavedStore } from '../../profile/store/saved.store';

import { StickyHeader } from '../components/StickyHeader';
import { AiDecisionBanner } from '../components/AiDecisionBanner';
import { CustomPromptModal } from '../components/CustomPromptModal';
import { ComparisonScopeSelector } from '../components/ComparisonScopeSelector';
import { MetricRow } from '../components/MetricRow';
import { CarPickerModal } from '../components/CarPickerModal';
import { AiChatModal } from '../components/AiChatModal';

export const ComparisonScreen: React.FC = () => {
  const params = useLocalSearchParams<{ carSlug?: string; carSlugs?: string; openChat?: string }>();
  const { isAuthenticated } = useAuthStore();
  const { isComparisonSaved, toggleSavedComparison } = useSavedStore();

  // Active selected cars (starts empty until user selects cars)
  const [selectedCars, setSelectedCars] = useState<ComparisonCar[]>([]);

  // Active comparison scope: 'Full' | 'Overview' | 'Specs' | 'Safety' | 'Features'
  const [activeScope, setActiveScope] = useState<ComparisonScope>('Full');

  // Custom user prompt state
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Modals state
  const [isPromptModalVisible, setIsPromptModalVisible] = useState<boolean>(false);
  const [isCarPickerVisible, setIsCarPickerVisible] = useState<boolean>(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);
  const [activeSlotToSwap, setActiveSlotToSwap] = useState<number | null>(null);

  // Dynamic AI Verdict state powered by Grok AI API
  const [aiVerdict, setAiVerdict] = useState<AiVerdictData>(() =>
    generateAiVerdict(selectedCars, customPrompt)
  );
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [hasRunComparison, setHasRunComparison] = useState<boolean>(false);

  const comparisonId = selectedCars.length >= 2
    ? `comp-${selectedCars.map((c) => c.slug).sort().join('-')}`
    : '';
  const isAlreadySaved = isComparisonSaved(comparisonId);

  // Auto-open chatbot modal if navigated with openChat=true
  useEffect(() => {
    if (params.openChat === 'true') {
      setIsChatModalVisible(true);
    }
  }, [params.openChat]);

  // Load car(s) from route params (carSlug or comma-separated carSlugs)
  useEffect(() => {
    if (params.carSlugs) {
      const slugs = (params.carSlugs as string).split(',').filter(Boolean);
      const loadedCars: ComparisonCar[] = [];

      slugs.forEach((slug) => {
        const mockCar = COMPARISON_CARS_DATABASE.find(
          (c) =>
            c.slug === slug ||
            c.id === slug ||
            `${c.brandName}-${c.modelName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(slug.toLowerCase())
        );
        if (mockCar) {
          loadedCars.push(mockCar);
        }
      });

      if (loadedCars.length > 0) {
        setSelectedCars(loadedCars);
        setHasRunComparison(false);
      }
    } else if (params.carSlug) {
      const slug = params.carSlug as string;

      // 1. Look up car in COMPARISON_CARS_DATABASE first (instant 0ms placement!)
      const mockCar = COMPARISON_CARS_DATABASE.find(
        (c) =>
          c.slug === slug ||
          c.id === slug ||
          `${c.brandName}-${c.modelName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(slug.toLowerCase())
      );

      if (mockCar) {
        setSelectedCars((prev) => {
          // If car is already in comparison box, keep state
          if (prev.some((c) => c.id === mockCar.id || c.slug === mockCar.slug)) {
            return prev;
          }
          // If comparison box is empty, place as Car 1
          if (prev.length === 0) return [mockCar];
          // If 1 car exists, place as Car 2 (creates 2-car comparison matrix directly!)
          if (prev.length === 1) return [prev[0], mockCar];
          // If 2+ cars exist, replace Car 2 with newly selected car
          return [prev[0], mockCar];
        });
        setHasRunComparison(false);
      } else {
        // Fallback to catalogApi.fetchVariantDetails
        catalogApi.fetchVariantDetails(slug).then((variant) => {
          if (variant) {
            const compCar = mapVariantToComparisonCar(variant);
            setSelectedCars((prev) => {
              if (prev.some((c) => c.id === compCar.id || c.slug === compCar.slug)) return prev;
              if (prev.length === 0) return [compCar];
              return [prev[0], compCar];
            });
            setHasRunComparison(false);
          }
        });
      }
    }
  }, [params.carSlug, params.carSlugs]);

  const requireAuthOrNavigateToProfile = (): boolean => {
    if (!isAuthenticated) {
      router.push('/(tabs)/profile');
      return false;
    }
    return true;
  };

  const handleRunComparison = async (overridePrompt?: string) => {
    if (!requireAuthOrNavigateToProfile()) return;

    if (selectedCars.length < 2) {
      setIsCarPickerVisible(true);
      return;
    }

    const activePrompt = overridePrompt !== undefined ? overridePrompt : customPrompt;

    setIsAiLoading(true);
    setHasRunComparison(true);
    try {
      const res = await fetchGrokComparisonVerdict(selectedCars, activePrompt);
      setAiVerdict(res);
    } catch (err) {
      console.warn('Error running AI comparison:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveComparison = () => {
    if (!requireAuthOrNavigateToProfile()) return;

    if (selectedCars.length < 2) {
      Alert.alert('Select Vehicles', 'Please select at least 2 vehicles to save a comparison.');
      return;
    }

    const title = selectedCars.map((c) => `${c.brandName} ${c.modelName}`).join(' vs ');
    const createdDate = `Created ${new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;

    const item = {
      id: comparisonId,
      title,
      createdDate,
      leftCarImage: selectedCars[0]?.imageUrl || '',
      rightCarImage: selectedCars[1]?.imageUrl || selectedCars[0]?.imageUrl || '',
      variantSlugs: selectedCars.map((c) => c.slug),
    };

    const saved = toggleSavedComparison(item);
    if (saved) {
      Alert.alert('Comparison Saved', 'This comparison has been saved to your Profile garage.');
    }
  };

  const handleOpenChat = () => {
    if (!requireAuthOrNavigateToProfile()) return;
    setIsChatModalVisible(true);
  };

  const handleOpenPrompt = () => {
    if (!requireAuthOrNavigateToProfile()) return;
    setIsPromptModalVisible(true);
  };

  const handleRequestQuote = () => {
    if (!requireAuthOrNavigateToProfile()) return;
    Alert.alert('Dealer Quote Requested', 'A representative will contact you shortly with official pricing.');
  };

  const handleApplyPrompt = (newPrompt: string) => {
    setCustomPrompt(newPrompt);
    if (selectedCars.length >= 2) {
      handleRunComparison(newPrompt);
    }
  };

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
    if (!requireAuthOrNavigateToProfile()) return;
    setActiveSlotToSwap(null);
    setIsCarPickerVisible(true);
  };

  const handleSwapCar = (index: number) => {
    if (!requireAuthOrNavigateToProfile()) return;
    setActiveSlotToSwap(index);
    setIsCarPickerVisible(true);
  };

  const handleRemoveCar = (index: number) => {
    const updated = selectedCars.filter((_, i) => i !== index);
    setSelectedCars(updated);
    if (updated.length < 2) {
      setHasRunComparison(false);
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
    setHasRunComparison(false);
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

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={styles.chatHeaderBtn}
            onPress={handleOpenChat}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
            <Text style={styles.chatHeaderBtnText}>Ask AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={handleOpenPrompt}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={18} color="#0F3040" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sticky 2-Column or 3-Column Header */}
      <StickyHeader
        cars={selectedCars}
        winnerCarId={hasRunComparison ? aiVerdict.winnerCarId : undefined}
        onAddCarPress={handleAddCar}
        onSwapCarPress={handleSwapCar}
        onRemoveCarPress={handleRemoveCar}
      />

      {/* Scrollable Content Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* Custom Prompt Input Bar */}
        <View style={styles.promptBarWrapper}>
          <TouchableOpacity
            style={styles.promptBarCard}
            onPress={handleOpenPrompt}
            activeOpacity={0.85}
          >
            <View style={styles.promptIconCircle}>
              <Ionicons name="create-outline" size={16} color="#0F3040" />
            </View>
            <View style={styles.promptTextContainer}>
              <Text style={styles.promptLabel}>
                {customPrompt ? 'Custom Driver Priority Active' : 'Add Custom Driver Prompt'}
              </Text>
              <Text style={styles.promptSubText} numberOfLines={1}>
                {customPrompt
                  ? `"${customPrompt}"`
                  : 'e.g. "I want a daily Cairo commuter with low fuel usage..."'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* EXPLICIT COMPARE & SAVE BUTTON ACTIONS */}
        <View style={styles.compareBtnWrapper}>
          <TouchableOpacity
            style={styles.mainCompareButton}
            onPress={() => handleRunComparison()}
            disabled={isAiLoading}
            activeOpacity={0.85}
          >
            {isAiLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="flash" size={18} color="#F59E0B" />
            )}
            <Text style={styles.mainCompareButtonText}>
              {isAiLoading ? 'Analyzing Vehicle Specs with Grok AI...' : 'Compare Cars with Grok AI'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedCars.length >= 2 && (
            <TouchableOpacity
              style={[styles.saveComparisonButton, isAlreadySaved && styles.saveComparisonButtonSaved]}
              onPress={handleSaveComparison}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isAlreadySaved ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isAlreadySaved ? '#C4342B' : '#0F3040'}
              />
              <Text style={[styles.saveComparisonButtonText, isAlreadySaved && styles.saveComparisonButtonTextSaved]}>
                {isAlreadySaved ? 'Comparison Saved ✓' : 'Save Results'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ask AI Chatbot Trigger Card */}
        <TouchableOpacity
          style={styles.askAiCardTrigger}
          onPress={handleOpenChat}
          activeOpacity={0.85}
        >
          <View style={styles.askAiIconCircle}>
            <Ionicons name="chatbubbles" size={18} color="#38BDF8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.askAiCardTitle}>Ask AutoVersus AI Advisor</Text>
            <Text style={styles.askAiCardSub}>
              Have questions about resale value, reliability, parts, or maintenance? Chat live with AI!
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#38BDF8" />
        </TouchableOpacity>

        {/* AI Smart Decision Banner */}
        {(hasRunComparison || isAiLoading) && (
          <AiDecisionBanner
            verdict={aiVerdict}
            isLoading={isAiLoading}
            onPersonalizePress={handleOpenPrompt}
          />
        )}

        {/* Comparison Scope Filter Tabs (Full, Overview, Specs, Safety, Features) */}
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
          <TouchableOpacity style={styles.quoteButton} onPress={handleRequestQuote} activeOpacity={0.85}>
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
        onApplyPrompt={handleApplyPrompt}
      />

      <CarPickerModal
        visible={isCarPickerVisible}
        availableCars={COMPARISON_CARS_DATABASE}
        selectedCarIds={selectedCars.map((c) => c.id)}
        onClose={() => setIsCarPickerVisible(false)}
        onSelectCar={handleSelectCarFromPicker}
      />

      <AiChatModal
        visible={isChatModalVisible}
        carsInComparison={selectedCars}
        onClose={() => setIsChatModalVisible(false)}
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
  chatHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3040',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  chatHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
  compareBtnWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  askAiCardTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F3040',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    gap: 12,
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  askAiIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askAiCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  askAiCardSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  mainCompareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F3040',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 10,
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  mainCompareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  saveComparisonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F3040',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
    marginTop: 10,
  },
  saveComparisonButtonSaved: {
    backgroundColor: '#FEE2E2',
    borderColor: '#C4342B',
  },
  saveComparisonButtonText: {
    color: '#0F3040',
    fontSize: 14,
    fontWeight: '800',
  },
  saveComparisonButtonTextSaved: {
    color: '#C4342B',
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
