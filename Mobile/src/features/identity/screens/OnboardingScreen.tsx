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
import { useAuthStore } from '../store/auth.store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideData {
  id: string;
  slideNumber: string;
  imageSource?: any;
  imageUri?: string;
  preHeaderIcon: keyof typeof Ionicons.glyphMap;
  preHeaderText: string;
  headline: string;
  subtitle: string;
  overlayOpacity?: number;
}

const ALL_SLIDES: SlideData[] = [
  {
    id: '1',
    slideNumber: '01',
    imageUri: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'car-outline',
    preHeaderText: 'THE CAR ENCYCLOPEDIA',
    headline: 'Every car has a story.',
    subtitle: 'Explore the details, history, and character behind every model ever made in Egypt & MENA.',
    overlayOpacity: 0.20,
  },
  {
    id: '2',
    slideNumber: '02',
    imageUri: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'flash-outline',
    preHeaderText: 'SPECIFICATION ENGINE',
    headline: 'Every spec verified. Zero guesswork.',
    subtitle: 'Browse verified factory data, horsepower, battery range, and official regional pricing.',
    overlayOpacity: 0.45,
  },
  {
    id: '3',
    slideNumber: '03',
    imageSource: require('../../../../assets/images/carpriceslide.jpg'),
    preHeaderIcon: 'newspaper-outline',
    preHeaderText: 'MARKET PRICE WATCH',
    headline: 'Track prices as they move.',
    subtitle: 'Stay ahead of official agency MSRP changes, dealership overprices, and market shifts in real time.',
    overlayOpacity: 0.35,
  },
  {
    id: '4',
    slideNumber: '04',
    imageSource: require('../../../../assets/images/compareslide.jpg'),
    preHeaderIcon: 'swap-horizontal-outline',
    preHeaderText: 'HEAD-TO-HEAD BATTLES',
    headline: 'Side-by-side clarity.',
    subtitle: 'Compare up to 5 cars instantly across dimensions, safety, performance, and winner metrics.',
    overlayOpacity: 0.35,
  },
  {
    id: '5',
    slideNumber: '05',
    imageSource: require('../../../../assets/images/chooseslide.jpg'),
    preHeaderIcon: 'color-wand-outline',
    preHeaderText: 'AI LIFESTYLE MATCHING',
    headline: 'Which car fits your life?',
    subtitle: 'Answer 5 lifestyle questions to receive AI-backed car recommendations tailored for your commute.',
    overlayOpacity: 0.35,
  },
  {
    id: '6',
    slideNumber: '06',
    imageUri: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    preHeaderIcon: 'rocket-outline',
    preHeaderText: 'START YOUR JOURNEY',
    headline: 'Ready to make the smart choice?',
    subtitle: 'Join thousands of Egyptian drivers making data-backed car buying decisions.',
    overlayOpacity: 0.55,
  },
];

export const OnboardingScreen: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState<'EN' | 'AR'>('EN');
  const scrollViewRef = useRef<ScrollView>(null);

  // If signed in, show only 5 slides (omit 6th auth slide). If signed out, show all 6.
  const activeSlides = isAuthenticated ? ALL_SLIDES.slice(0, 5) : ALL_SLIDES;
  const maxSlideIndex = activeSlides.length - 1;

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide !== activeSlideIndex && slide >= 0 && slide <= maxSlideIndex) {
      setActiveSlideIndex(slide);
    }
  };

  const goToNextSlide = () => {
    if (activeSlideIndex < maxSlideIndex) {
      scrollViewRef.current?.scrollTo({
        x: (activeSlideIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else if (isAuthenticated) {
      // On 5th slide while signed in -> Back to Home
      router.replace('/');
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
        {activeSlides.map((slide, index) => {
          const isFirstSlide = index === 0;
          const isFinalSlide = index === maxSlideIndex && !isAuthenticated;
          const currentOverlayOpacity = slide.overlayOpacity || 0.45;
          const imageSourceProp = slide.imageSource ? slide.imageSource : { uri: slide.imageUri };

          return (
            <View
              key={slide.id}
              nativeID={`onboarding-slide-${slide.id}`}
              testID={`onboarding-slide-${slide.id}`}
              style={styles.slideCard}
            >
              {/* Full-Bleed Background Photo taking over the whole screen */}
              <Image source={imageSourceProp} style={styles.fullScreenBgImage} resizeMode="cover" />

              {/* Dynamic Gradient Darkness Overlay */}
              <View
                nativeID={`onboarding-slide-${slide.id}-gradient-overlay`}
                style={[
                  styles.fullScreenGradientOverlay,
                  { backgroundColor: `rgba(5, 15, 25, ${currentOverlayOpacity})` },
                ]}
              />

              {/* Top Navigation Overlay Bar */}
              <View nativeID={`onboarding-slide-${slide.id}-top-header`} style={styles.topHeaderOverlay}>
                <View style={styles.logoRow} />

                {/* Skip button visible on non-final slides */}
                {activeSlideIndex < maxSlideIndex && (
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
                {/* Slide 1 Hero Logo */}
                {isFirstSlide && (
                  <View nativeID="onboarding-slide1-hero-container" testID="onboarding-slide1-hero-container" style={styles.slide1HeroLogoContainer}>
                    <Image
                      nativeID="onboarding-hero-logo-large"
                      testID="onboarding-hero-logo-large"
                      source={require('../../../../assets/images/avLogo-removebg-preview.png')}
                      style={styles.heroLogoDoubleSize}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {/* Floating Direct Text Block */}
                {!isFinalSlide && (
                  <View nativeID={`onboarding-content-card-${slide.id}`} testID={`onboarding-content-card-${slide.id}`} style={styles.floatingTextBlock}>
                    <View style={styles.preHeaderRow}>
                      <Ionicons name={slide.preHeaderIcon} size={14} color="#FF4D3D" />
                      <Text style={styles.preHeaderText}>{slide.preHeaderText}</Text>
                    </View>

                    <Text style={styles.mainHeadline}>{slide.headline}</Text>
                    <Text style={styles.subtitleText}>{slide.subtitle}</Text>
                  </View>
                )}

                {/* Final Slide 6 Authentication Stack (Only shown when unauthenticated on slide 6) */}
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

      {/* Bottom Navigation Overlay Bar */}
      {!(activeSlideIndex === 5 && !isAuthenticated) && (
        <View nativeID="onboarding-footer-navigation-bar" testID="onboarding-footer-navigation-bar" style={styles.footerBarOverlay}>
          {/* Progress Dots */}
          <View nativeID="onboarding-progress-dots" testID="onboarding-progress-dots" style={styles.dotsRow}>
            {activeSlides.map((_, index) => {
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

            {/* Next / Back to Home Button */}
            <TouchableOpacity
              testID="onboarding-next-slide-button"
              accessibilityLabel={isAuthenticated && activeSlideIndex === 4 ? 'Back to Home' : 'Next Slide'}
              style={styles.redNextPillButton}
              onPress={goToNextSlide}
              activeOpacity={0.85}
            >
              <Text style={styles.redNextPillText}>
                {isAuthenticated && activeSlideIndex === 4 ? 'Back to Home' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Micro Bottom Subtitle */}
      {!(activeSlideIndex === 5 && !isAuthenticated) && (
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
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 60 : 100,
    paddingBottom: 95,
    justifyContent: 'space-between',
    zIndex: 10,
  },

  /* Slide 1 Hero Logo */
  slide1HeroLogoContainer: {
    alignItems: 'center',
    marginTop: -110,
  },
  heroLogoDoubleSize: {
    width: SCREEN_WIDTH * 0.96,
    height: 440,
  },

  /* Floating Direct Text Block */
  floatingTextBlock: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    gap: 6,
    marginBottom: 10,
  },
  preHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  preHeaderText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF4D3D',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mainHeadline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.4,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* Final Slide 6 Auth Container */
  finalAuthContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  finalTypographyBlock: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
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
    color: 'rgba(255, 255, 255, 0.85)',
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

  /* Bottom Navigation Overlay Bar */
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
