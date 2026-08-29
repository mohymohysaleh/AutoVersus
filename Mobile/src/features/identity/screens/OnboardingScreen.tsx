import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideData {
  id: string;
  slideNumber: string;
  imageUri: string;
  preHeaderIcon: keyof typeof Ionicons.glyphMap;
  preHeaderText: string;
  headline: string;
  subtitle: string;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    slideNumber: '01',
    imageUri: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'car-outline',
    preHeaderText: 'THE CAR ENCYCLOPEDIA',
    headline: 'Every car has a story.',
    subtitle: 'Explore the details, history, and character behind every model ever made in Egypt & MENA.',
  },
  {
    id: '2',
    slideNumber: '02',
    imageUri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'flash-outline',
    preHeaderText: 'SPECIFICATION ENGINE',
    headline: 'Every spec verified. Zero guesswork.',
    subtitle: 'Browse verified factory data, horsepower, battery range, and official regional pricing.',
  },
  {
    id: '3',
    slideNumber: '03',
    imageUri: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'newspaper-outline',
    preHeaderText: 'MARKET PRICE WATCH',
    headline: 'Track prices as they move.',
    subtitle: 'Stay ahead of official agency MSRP changes, dealership overprices, and market shifts in real time.',
  },
  {
    id: '4',
    slideNumber: '04',
    imageUri: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'swap-horizontal-outline',
    preHeaderText: 'HEAD-TO-HEAD BATTLES',
    headline: 'Side-by-side clarity.',
    subtitle: 'Compare up to 5 cars instantly across dimensions, safety, performance, and winner metrics.',
  },
  {
    id: '5',
    slideNumber: '05',
    imageUri: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'color-wand-outline',
    preHeaderText: 'AI LIFESTYLE MATCHING',
    headline: 'Which car fits your life?',
    subtitle: 'Answer 5 lifestyle questions to receive AI-backed car recommendations tailored for your commute.',
  },
  {
    id: '6',
    slideNumber: '06',
    imageUri: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'rocket-outline',
    preHeaderText: 'START YOUR JOURNEY',
    headline: 'Ready to make the smart choice?',
    subtitle: 'Join thousands of Egyptian drivers making data-backed car buying decisions.',
  },
];

export const OnboardingScreen: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState<'EN' | 'AR'>('EN');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide !== activeSlideIndex) {
      setActiveSlideIndex(slide);
    }
  };

  const goToNextSlide = () => {
    if (activeSlideIndex < 5) {
      scrollViewRef.current?.scrollTo({
        x: (activeSlideIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const goToPrevSlide = () => {
    if (activeSlideIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (activeSlideIndex - 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleCreateAccount = () => {
    router.push({
      pathname: '/auth',
      params: { mode: 'signup' },
    });
  };

  const handleSignIn = () => {
    router.push({
      pathname: '/auth',
      params: { mode: 'signin' },
    });
  };

  const handleContinueAsGuest = () => {
    router.replace('/');
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'EN' ? 'AR' : 'EN'));
  };

  return (
    <SafeAreaView nativeID="onboarding-screen-container" testID="onboarding-screen-container" style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Main Horizontal Full-Screen Carousel */}
      <ScrollView
        nativeID="onboarding-carousel-scrollview"
        testID="onboarding-carousel-scrollview"
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carouselContainer}
      >
        {SLIDES.map((slide, index) => {
          const isFirstSlide = index === 0;
          const isFinalSlide = index === 5;

          return (
            <View
              key={slide.id}
              nativeID={`onboarding-slide-${slide.id}`}
              testID={`onboarding-slide-${slide.id}`}
              style={styles.slideCard}
            >
              {/* Full-Bleed Background Photo taking over the whole screen */}
              <Image source={{ uri: slide.imageUri }} style={styles.fullScreenBgImage} resizeMode="cover" />

              {/* Gradient Darkness Overlay for crisp text legibility */}
              <View nativeID={`onboarding-slide-${slide.id}-gradient-overlay`} style={styles.fullScreenGradientOverlay} />

              {/* Top Navigation Overlay Bar */}
              <View nativeID={`onboarding-slide-${slide.id}-top-header`} style={styles.topHeaderOverlay}>
                <View style={styles.logoRow}>
                  {!isFirstSlide && (
                    <Image
                      nativeID="onboarding-header-logo"
                      testID="onboarding-header-logo"
                      source={require('../../../../assets/images/avLogo-removebg-preview.png')}
                      style={styles.brandLogoHeaderLarge}
                      resizeMode="contain"
                    />
                  )}
                </View>

                {activeSlideIndex < 5 && (
                  <TouchableOpacity
                    testID="onboarding-skip-button"
                    accessibilityLabel="Skip Onboarding"
                    onPress={handleContinueAsGuest}
                    activeOpacity={0.7}
                    style={styles.skipButton}
                  >
                    <Text style={styles.skipText}>Skip</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Slide Content Fill */}
              <View nativeID={`onboarding-slide-${slide.id}-content-fill`} style={styles.slideContentFill}>
                {/* Slide 1 Hero Logo & Visual Features Banner */}
                {isFirstSlide && (
                  <View nativeID="onboarding-slide1-hero-container" testID="onboarding-slide1-hero-container" style={styles.slide1HeroLogoContainer}>
                    <Image
                      nativeID="onboarding-hero-logo-large"
                      testID="onboarding-hero-logo-large"
                      source={require('../../../../assets/images/avLogo-removebg-preview.png')}
                      style={styles.heroLogoNinetyPercent}
                      resizeMode="contain"
                    />

                    {/* Rich Visual Pills Box */}
                    <View nativeID="onboarding-visual-pills-box" testID="onboarding-visual-pills-box" style={styles.visualPillsBox}>
                      <View style={styles.visualPillRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#FF4D3D" />
                        <Text style={styles.visualPillText}>3,500+ Verified Car Trims & Specs</Text>
                      </View>
                      <View style={styles.visualPillRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#FF4D3D" />
                        <Text style={styles.visualPillText}>Egypt Official MSRP vs Dealer Price Tracker</Text>
                      </View>
                      <View style={styles.visualPillRow}>
                        <Ionicons name="checkmark-circle" size={16} color="#FF4D3D" />
                        <Text style={styles.visualPillText}>2-Minute AI Lifestyle Matcher</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Number Badge Top Left (Slides 2 to 5) */}
                {!isFirstSlide && (
                  <View nativeID={`onboarding-slide-badge-${slide.id}`} style={styles.slideIndexPill}>
                    <Text style={styles.slideIndexText}>{slide.slideNumber}</Text>
                  </View>
                )}

                {/* Floating Content Section (Slides 1 to 5) */}
                {!isFinalSlide && (
                  <View nativeID={`onboarding-content-card-${slide.id}`} testID={`onboarding-content-card-${slide.id}`} style={styles.floatingContentBlock}>
                    <View style={styles.preHeaderRow}>
                      <Ionicons name={slide.preHeaderIcon} size={14} color="#FF4D3D" />
                      <Text style={styles.preHeaderText}>{slide.preHeaderText}</Text>
                    </View>

                    <Text style={styles.mainHeadline}>{slide.headline}</Text>
                    <Text style={styles.subtitleText}>{slide.subtitle}</Text>
                  </View>
                )}

                {/* Final Slide 6 Authentication Stack */}
                {isFinalSlide && (
                  <View nativeID="onboarding-final-auth-container" testID="onboarding-final-auth-container" style={styles.finalAuthContainer}>
                    <View style={styles.finalTypographyBlock}>
                      <View style={styles.preHeaderRow}>
                        <Ionicons name={slide.preHeaderIcon} size={14} color="#FF4D3D" />
                        <Text style={styles.preHeaderText}>{slide.preHeaderText}</Text>
                      </View>

                      <Text style={styles.mainHeadline}>{slide.headline}</Text>
                      <Text style={styles.subtitleText}>{slide.subtitle}</Text>
                    </View>

                    <View nativeID="onboarding-auth-actions-stack" testID="onboarding-auth-actions-stack" style={styles.finalActionStack}>
                      <TouchableOpacity
                        testID="onboarding-create-account-button"
                        accessibilityLabel="Create an Account"
                        style={styles.redNextButtonFull}
                        onPress={handleCreateAccount}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.redNextButtonText}>Create an Account</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        testID="onboarding-signin-button"
                        accessibilityLabel="Sign In"
                        style={styles.glassSignInButton}
                        onPress={handleSignIn}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.glassSignInText}>Sign In to Account</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        testID="onboarding-guest-button"
                        accessibilityLabel="Continue as Guest"
                        style={styles.guestLinkButton}
                        onPress={handleContinueAsGuest}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.guestLinkText}>Continue as Guest →</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        testID="onboarding-language-toggle-button"
                        accessibilityLabel="Toggle Language"
                        onPress={toggleLanguage}
                        activeOpacity={0.7}
                        style={styles.langPill}
                      >
                        <Ionicons name="globe-outline" size={13} color="#FFFFFF" />
                        <Text style={styles.langPillText}>
                          {currentLang === 'EN' ? 'العربية / English' : 'English / العربية'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Navigation Overlay Bar (Slides 1 to 5) */}
      {activeSlideIndex < 5 && (
        <View nativeID="onboarding-footer-navigation-bar" testID="onboarding-footer-navigation-bar" style={styles.footerBarOverlay}>
          {/* Progress Dots (Left) */}
          <View nativeID="onboarding-progress-dots" testID="onboarding-progress-dots" style={styles.dotsRow}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isActive = index === activeSlideIndex;
              return (
                <View
                  key={index}
                  nativeID={`onboarding-dot-${index}`}
                  style={[
                    styles.dotBase,
                    isActive ? styles.dotActiveRed : styles.dotInactiveCircle,
                  ]}
                />
              );
            })}
          </View>

          {/* Action Buttons (Right) */}
          <View style={styles.footerNavButtonsRight}>
            {/* Circular Back Arrow Button */}
            {activeSlideIndex > 0 && (
              <TouchableOpacity
                testID="onboarding-prev-slide-button"
                accessibilityLabel="Previous Slide"
                style={styles.circleBackButton}
                onPress={goToPrevSlide}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* Rounded Red Next Button */}
            <TouchableOpacity
              testID="onboarding-next-slide-button"
              accessibilityLabel="Next Slide"
              style={styles.redNextPillButton}
              onPress={goToNextSlide}
              activeOpacity={0.85}
            >
              <Text style={styles.redNextPillText}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Micro Bottom Subtitle */}
      {activeSlideIndex < 5 && (
        <View nativeID="onboarding-micro-footer-text" style={styles.microBottomRow}>
          <Ionicons name="search-outline" size={11} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.microBottomText}>Tap, swipe, discover</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* Carousel */
  carouselContainer: {
    flex: 1,
  },
  slideCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },

  /* Full-Bleed Photo taking over the whole screen */
  fullScreenBgImage: {
    ...StyleSheet.absoluteFill,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullScreenGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5, 15, 25, 0.60)',
  },

  /* Top Navigation Overlay Bar */
  topHeaderOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  logoRow: {
    height: 40,
    justifyContent: 'center',
  },
  brandLogoHeaderLarge: {
    width: 160,
    height: 40,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Slide Content Fill */
  slideContentFill: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 60 : 100,
    paddingBottom: 100, // Generous padding to prevent overlap with footer bar
    justifyContent: 'space-between',
    zIndex: 10,
  },

  /* Slide 1 Hero Logo */
  slide1HeroLogoContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  heroLogoNinetyPercent: {
    width: SCREEN_WIDTH * 0.95,
    height: 380,
  },
  visualPillsBox: {
    width: '100%',
    backgroundColor: 'rgba(15, 41, 66, 0.88)',
    borderRadius: 20,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  visualPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visualPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Slide Index Pill (Slides 2 to 5) */
  slideIndexPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  slideIndexText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  /* Floating Content Block (Slides 1 to 5) */
  floatingContentBlock: {
    backgroundColor: 'rgba(8, 25, 36, 0.92)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
    marginBottom: 75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  preHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  preHeaderText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FF4D3D',
    letterSpacing: 1.2,
  },
  mainHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
    letterSpacing: -0.4,
    textAlign: 'left',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    textAlign: 'left',
  },

  /* Final Slide 6 Auth Container */
  finalAuthContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  finalTypographyBlock: {
    backgroundColor: 'rgba(8, 25, 36, 0.92)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 6,
  },
  finalActionStack: {
    gap: 10,
  },
  redNextButtonFull: {
    height: 52,
    backgroundColor: '#FF4D3D',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4D3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  redNextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  glassSignInButton: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassSignInText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  guestLinkButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  guestLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    gap: 6,
    alignSelf: 'center',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Bottom Navigation Overlay Bar (Slides 1 to 5) */
  footerBarOverlay: {
    position: 'absolute',
    bottom: 26,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotBase: {
    height: 6,
    borderRadius: 3,
  },
  dotActiveRed: {
    width: 24,
    backgroundColor: '#FF4D3D',
  },
  dotInactiveCircle: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  footerNavButtonsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redNextPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4D3D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 6,
    shadowColor: '#FF4D3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  redNextPillText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Micro Bottom Subtitle */
  microBottomRow: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 30,
  },
  microBottomText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
