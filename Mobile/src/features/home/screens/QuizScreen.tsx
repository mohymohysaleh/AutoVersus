import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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

  const currentQuestion = QUIZ_QUESTIONS[currentStepIndex];
  const selectedOptionId = answers[currentQuestion.step];
  const progressPercentage = ((currentStepIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.step]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Quiz completed! Navigate to search results with matched recommendations
      router.replace('/(tabs)/search');
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.stepIndicatorText}>
          Question {currentQuestion.step} of {QUIZ_QUESTIONS.length}
        </Text>

        {/* Balance layout */}
        <View style={{ width: 36 }} />
      </View>

      {/* Progress Bar Track */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressActive, { width: `${progressPercentage}%` }]} />
      </View>

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.tagLabel}>FIND MY CAR</Text>
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
                    color={isSelected ? '#0F2942' : '#0F2942'}
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
      </ScrollView>

      {/* Bottom Action Footer */}
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

        {/* Next Step / Complete Button */}
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
            {currentStepIndex === QUIZ_QUESTIONS.length - 1 ? 'See My Matches 🎉' : 'Next Step'}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={selectedOptionId ? '#FFFFFF' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
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
  progressTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  progressActive: {
    height: 4,
    backgroundColor: '#C92A2A', // Accent red progress line
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 28,
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
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  optionsList: {
    gap: 16,
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
