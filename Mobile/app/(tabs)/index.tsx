import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import { Header } from '../../src/features/home/components/Header';
import { SearchBar } from '../../src/features/home/components/SearchBar';
import { CategoryChips } from '../../src/features/home/components/CategoryChips';
import { FindMyCarBanner } from '../../src/features/home/components/FindMyCarBanner';
import { TrendingCarsList, TrendingCarItem } from '../../src/features/home/components/TrendingCarsList';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState<'EN' | 'AR'>('EN');

  const handleLanguageToggle = () => {
    setCurrentLang((prev) => (prev === 'EN' ? 'AR' : 'EN'));
  };

  const handleCarPress = (car: TrendingCarItem) => {
    router.push({
      pathname: '/car/[slug]',
      params: { slug: car.slug },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Fixed Header */}
      <Header
        currentLang={currentLang}
        onLanguageToggle={handleLanguageToggle}
        onNotificationPress={() => console.log('Notification pressed')}
      />

      {/* Main Scrollable Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search & Filter Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => router.push('/(tabs)/search')}
        />

        {/* Category Horizontal Chips */}
        <CategoryChips
          onSelectCategory={(cat) => router.push('/(tabs)/search')}
        />

        {/* AI "Find My Car" Banner */}
        <FindMyCarBanner
          onQuizPress={() => router.push('/quiz')}
        />

        {/* Popular Now: Trending Cars Horizontal List */}
        <TrendingCarsList
          onSeeAllPress={() => router.push('/(tabs)/search')}
          onCarPress={handleCarPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
