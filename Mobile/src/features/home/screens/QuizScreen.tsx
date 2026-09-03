import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  fetchQuizAiRecommendations,
  getInstantQuizMatches,
  QuizResultCar,
} from '../../comparison/services/comparison-api.service';
import { ComparisonCar } from '../../comparison/types/comparison.types';

export interface QuizOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface QuizQuestion {
  step: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    step: 1,
    question: 'What kind of car are you looking for?',
    subtitle: 'Choose the shape that feels right for you.',
    options: [
      { id: 'suv', label: 'SUV & Crossover', icon: 'triangle-outline' },
      { id: 'sedan', label: 'Sedan & Saloon', icon: 'speedometer-outline' },
      { id: 'hatchback', label: 'Hatchback', icon: 'car-sport-outline' },
      { id: 'open', label: "I'm open to anything", icon: 'map-outline' },
    ],
  },
  {
    step: 2,
    question: 'What is your target budget range?',
    subtitle: 'Select your preferred price bracket in EGP.',
    options: [
      { id: 'b1', label: 'Under EGP 1,500,000', icon: 'wallet-outline' },
      { id: 'b2', label: 'EGP 1.5M - 2.5M', icon: 'cash-outline' },
      { id: 'b3', label: 'EGP 2.5M - 4.0M', icon: 'card-outline' },
      { id: 'b4', label: 'EGP 4.0M+', icon: 'diamond-outline' },
    ],
  },
  {
    step: 3,
    question: 'What is your primary daily driving scenario?',
    subtitle: 'Select the option that best fits your commute.',
    options: [
      { id: 'city', label: 'City Commute & Easy Parking', icon: 'business-outline' },
      { id: 'highway', label: 'Long Highway Trips', icon: 'navigate-outline' },
      { id: 'family', label: 'Family & School Runs', icon: 'people-outline' },
      { id: 'offroad', label: 'Off-Road & Adventure', icon: 'compass-outline' },
    ],
  },
  {
    step: 4,
    question: 'What fuel or powertrain type do you prefer?',
    subtitle: 'Choose between traditional or alternative energy.',
    options: [
      { id: 'petrol', label: 'Petrol / Gasoline', icon: 'flame-outline' },
      { id: 'hybrid', label: 'Hybrid (Fuel Efficient)', icon: 'leaf-outline' },
      { id: 'ev', label: 'All-Electric (EV)', icon: 'flash-outline' },
      { id: 'any_powertrain', label: 'No preference', icon: 'checkmark-circle-outline' },
    ],
  },
  {
    step: 5,
    question: 'What are your top priority features?',
    subtitle: 'What matters most in your next vehicle?',
    options: [
      { id: 'safety', label: 'Advanced Safety & ADAS', icon: 'shield-checkmark-outline' },
      { id: 'resale', label: 'High Resale Value & Reliability', icon: 'trending-up-outline' },
      { id: 'tech', label: 'Infotainment & Luxury Interior', icon: 'hardware-chip-outline' },
      { id: 'performance', label: 'Engine Power & Acceleration', icon: 'thunderstorm-outline' },
    ],
  },
];

export const QuizScreen: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Slide 6 AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiVerdictSummary, setAiVerdictSummary] = useState<string>('');
  const [recommendedCars, setRecommendedCars] = useState<QuizResultCar[]>([]);
  const [isVerdictExpanded, setIsVerdictExpanded] = useState<boolean>(false);

  const renderFormattedQuizText = (text: string) => {
    if (!text) return null;
    const cleanRaw = text.replace(/\*\*/g, '');
    const lines = cleanRaw.split('\n').filter((l) => l.trim().length > 0);

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Check header or emoji title
      if (
        trimmed.startsWith('🎯') ||
        trimmed.startsWith('❖') ||
        trimmed.startsWith('###') ||
        trimmed.toLowerCase().includes('verdict')
      ) {
        return (
          <View key={idx} style={styles.verdictSectionHeader}>
            <Text style={styles.verdictSectionHeaderText}>
              {trimmed.replace(/###/g, '').trim()}
            </Text>
          </View>
        );
      }

      // Check bullet point line
      const isBullet =
        trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');
      const bulletContent = isBullet
        ? trimmed.replace(/^[•\-\*]\s*/, '')
        : trimmed;

      return (
        <View key={idx} style={isBullet ? styles.bulletRow : styles.textRow}>
          {isBullet && <Text style={styles.bulletDot}>•</Text>}
          <Text style={styles.formattedTextBody}>{bulletContent}</Text>
        </View>
      );
    });
  };

  const isResultsSlide = currentStepIndex === 5; // 6th Slide
  const currentQuestion = QUIZ_QUESTIONS[Math.min(currentStepIndex, 4)];
  const selectedOptionId = answers[currentQuestion.step];
  const progressPercentage = ((currentStepIndex + 1) / 6) * 100;

  // Run Grok AI evaluation when reaching Slide 6
  useEffect(() => {
    if (isResultsSlide) {
      // 1. Instantly populate top matched cars (0ms latency!)
      const instantMatches = getInstantQuizMatches(answers);
      setRecommendedCars(instantMatches);

      // 2. Fetch Grok AI verdict summary asynchronously
      setIsAiLoading(true);
      fetchQuizAiRecommendations(answers)
        .then((res) => {
          if (res.summary) setAiVerdictSummary(res.summary);
          if (res.matchedCars?.length > 0) setRecommendedCars(res.matchedCars);
        })
        .catch((err) => {
          console.warn('AI Quiz error:', err);
        })
        .finally(() => {
          setIsAiLoading(false);
        });
    }
  }, [isResultsSlide]);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.step]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < 5) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleOpenAiChat = () => {
    router.push({
      pathname: '/(tabs)/compare',
      params: { openChat: 'true' },
    });
  };

  const handleCompareCar = (car: ComparisonCar) => {
    router.push({
      pathname: '/(tabs)/compare',
      params: { carSlug: car.slug },
    });
  };

  const handleOpenCarDetails = (car: ComparisonCar) => {
    if (car.slug) {
      router.push(`/car/${car.slug}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.stepIndicatorText}>
          {isResultsSlide ? 'Slide 6 of 6 — AI Matches 🎉' : `Question ${currentQuestion.step} of 5`}
        </Text>

        <TouchableOpacity
          style={styles.headerAskAiButton}
          onPress={handleOpenAiChat}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={14} color="#F59E0B" />
          <Text style={styles.headerAskAiButtonText}>Ask AI</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar Track */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressActive, { width: `${progressPercentage}%` }]} />
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {!isResultsSlide ? (
          /* SLIDES 1 to 5: QUESTIONS */
          <>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.tagLabel}>FIND MY CAR • STEP {currentQuestion.step}</Text>
              <Text style={styles.headlineText}>{currentQuestion.question}</Text>
              <Text style={styles.subtitleText}>{currentQuestion.subtitle}</Text>
            </View>

            {/* Options List */}
            <View style={styles.optionsList}>
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => handleSelectOption(option.id)}
                    activeOpacity={0.85}
                  >
                    {/* Left Icon Container */}
                    <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                      <Ionicons
                        name={option.icon}
                        size={22}
                        color="#0F2942"
                      />
                    </View>

                    {/* Option Label */}
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>

                    {/* Right Selection Radio Circle */}
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          /* SLIDE 6: AI RESULTS SLIDE */
          <View style={styles.resultsContainer}>
            {/* Results Title Section */}
            <View style={styles.titleSection}>
              <View style={styles.aiBadgeTag}>
                <Ionicons name="sparkles" size={14} color="#F59E0B" />
                <Text style={styles.aiBadgeTagText}>GROK AI MATCHES</Text>
              </View>
              <Text style={styles.headlineText}>Your Recommended Vehicles</Text>
              <Text style={styles.subtitleText}>
                Analyzed by Grok AI Engine based on your budget, daily drive, and priority preferences.
              </Text>
            </View>

            {/* AI Rationale Summary Box */}
            <View style={styles.aiSummaryCard}>
              <View style={styles.aiSummaryHeader}>
                <View style={styles.aiAvatarCircle}>
                  <Ionicons name="hardware-chip" size={16} color="#F59E0B" />
                </View>
                <Text style={styles.aiSummaryTitle}>Grok AI Advisor Verdict</Text>
              </View>

              {isAiLoading && !aiVerdictSummary ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
                  <ActivityIndicator size="small" color="#F59E0B" />
                  <Text style={{ fontSize: 13, color: '#94A3B8' }}>Grok AI is generating custom analysis...</Text>
                </View>
              ) : (
                <View>
                  {/* Collapsed State vs Expanded State */}
                  {!isVerdictExpanded ? (
                    <Text style={styles.aiSummaryBodyCollapsed} numberOfLines={3}>
                      {aiVerdictSummary
                        ? aiVerdictSummary.replace(/\*\*/g, '').slice(0, 160) + '...'
                        : 'Based on your preferences and budget, these 3 vehicles offer the best reliability and daily value for Egyptian road conditions.'}
                    </Text>
                  ) : (
                    <View style={styles.expandedTextContainer}>
                      {renderFormattedQuizText(
                        aiVerdictSummary ||
                          'Based on your preferences and budget, these 3 vehicles offer the best reliability and daily value for Egyptian road conditions.'
                      )}
                    </View>
                  )}

                  {/* Dropdown Toggle Button */}
                  <TouchableOpacity
                    style={styles.dropdownToggleButton}
                    onPress={() => setIsVerdictExpanded(!isVerdictExpanded)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dropdownToggleText}>
                      {isVerdictExpanded ? 'Collapse AI Verdict' : 'Expand Full AI Rationale'}
                    </Text>
                    <Ionicons
                      name={isVerdictExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 3 Vehicle Recommendation Cards */}
                <View style={styles.carsListContainer}>
                  {recommendedCars.map((item, index) => {
                    const car = item.car;
                    return (
                      <TouchableOpacity
                        key={car.id || index}
                        style={styles.carMatchCard}
                        onPress={() => handleOpenCarDetails(car)}
                        activeOpacity={0.9}
                      >
                        {/* Match Percentage Badge */}
                        <View style={styles.matchBadge}>
                          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                          <Text style={styles.matchBadgeText}>{item.matchPercentage}% MATCH</Text>
                        </View>

                        {/* Car Image */}
                        <Image
                          source={{ uri: car.imageUrl }}
                          style={styles.carImage}
                          resizeMode="cover"
                        />

                        {/* Car Info */}
                        <View style={styles.carDetailsBox}>
                          <Text style={styles.carBrandText}>{car.brandName}</Text>
                          <Text style={styles.carModelText}>{car.modelName} {car.trimName}</Text>

                          <Text style={styles.carPriceText}>
                            EGP {car.startingPriceEGP.toLocaleString()}
                          </Text>

                          {/* Quick Spec Pills */}
                          <View style={styles.specPillsRow}>
                            <View style={styles.specPill}>
                              <Ionicons name="speedometer-outline" size={12} color="#0F2942" />
                              <Text style={styles.specPillText}>{car.horsepower} HP</Text>
                            </View>

                            <View style={styles.specPill}>
                              <Ionicons name="flame-outline" size={12} color="#0F2942" />
                              <Text style={styles.specPillText}>{car.fuelEconomyL100km} L/100km</Text>
                            </View>

                            <View style={styles.specPill}>
                              <Ionicons name="shield-checkmark-outline" size={12} color="#0F2942" />
                              <Text style={styles.specPillText}>{car.airbagsCount} Airbags</Text>
                            </View>
                          </View>

                          {/* Reason */}
                          <Text style={styles.matchReasonText}>{item.matchReason}</Text>

                          {/* Action Buttons Row */}
                          <View style={styles.cardActionsRow}>
                            <TouchableOpacity
                              style={styles.viewDetailsButton}
                              onPress={() => handleOpenCarDetails(car)}
                              activeOpacity={0.85}
                            >
                              <Ionicons name="information-circle-outline" size={15} color="#0F2942" />
                              <Text style={styles.viewDetailsButtonText}>View Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.compareCarButton}
                              onPress={() => handleCompareCar(car)}
                              activeOpacity={0.85}
                            >
                              <Text style={styles.compareCarButtonText}>Compare</Text>
                              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* ASK AI CHATBOT BANNER (CRITICAL REQUIREMENT) */}
                <View style={styles.askAiBannerCard}>
                  <View style={styles.askAiHeaderRow}>
                    <View style={styles.askAiIconCircle}>
                      <Ionicons name="chatbubbles" size={20} color="#38BDF8" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.askAiBannerTitle}>Questions were not enough?</Text>
                      <Text style={styles.askAiBannerSubtitle}>
                        Chat directly with AI Advisor for custom advice on maintenance, resale value, or car comparisons in Egypt.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.askAiButton}
                    onPress={handleOpenAiChat}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="sparkles" size={18} color="#0F2942" />
                    <Text style={styles.askAiButtonText}>Ask AI Advisor (Open Chatbot)</Text>
                  </TouchableOpacity>
                </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Footer */}
      {!isResultsSlide && (
        <View style={styles.footerBar}>
          {/* Back Link */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Next Step Button */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedOptionId ? styles.nextButtonActive : styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!selectedOptionId}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.nextButtonText,
                selectedOptionId ? styles.nextButtonTextActive : styles.nextButtonTextDisabled,
              ]}
            >
              {currentStepIndex === 4 ? 'See AI Matches 🎉' : 'Next Step'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicatorText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
  },
  headerAskAiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  headerAskAiButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  progressActive: {
    height: 4,
    backgroundColor: '#C92A2A',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headlineText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F2942',
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  optionsList: {
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: '#0F2942',
    backgroundColor: '#F8FAFC',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: '#E2E8F0',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F2942',
  },
  optionLabelSelected: {
    color: '#0F2942',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#0F2942',
    backgroundColor: '#0F2942',
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  aiBadgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 10,
  },
  aiBadgeTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.8,
  },
  loadingBox: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  aiSummaryCard: {
    backgroundColor: '#0F2942',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  aiAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSummaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F59E0B',
  },
  aiSummaryBody: {
    fontSize: 14,
    color: '#F1F5F9',
    lineHeight: 22,
  },
  aiSummaryBodyCollapsed: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 8,
  },
  expandedTextContainer: {
    gap: 8,
    marginVertical: 4,
  },
  dropdownToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 10,
  },
  dropdownToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
  },
  verdictSectionHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 4,
  },
  verdictSectionHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
    gap: 8,
    marginVertical: 3,
  },
  bulletDot: {
    fontSize: 14,
    color: '#38BDF8',
    fontWeight: '900',
    marginTop: 1,
  },
  textRow: {
    marginVertical: 2,
  },
  formattedTextBody: {
    flex: 1,
    fontSize: 14,
    color: '#F1F5F9',
    lineHeight: 22,
  },
  carsListContainer: {
    gap: 18,
    marginBottom: 24,
  },
  carMatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  matchBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  carImage: {
    width: '100%',
    height: 180,
  },
  carDetailsBox: {
    padding: 16,
  },
  carBrandText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  carModelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F2942',
    marginTop: 2,
    marginBottom: 6,
  },
  carPriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C92A2A',
    marginBottom: 12,
  },
  specPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  specPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F2942',
  },
  matchReasonText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  viewDetailsButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F2942',
  },
  compareCarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F2942',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  compareCarButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  askAiBannerCard: {
    backgroundColor: '#0F2942',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginTop: 8,
  },
  askAiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  askAiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askAiBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  askAiBannerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 19,
  },
  askAiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
  },
  askAiButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F2942',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  nextButtonActive: {
    backgroundColor: '#0F2942',
  },
  nextButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  nextButtonTextActive: {
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#FFFFFF',
  },
});
