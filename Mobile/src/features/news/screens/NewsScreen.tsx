import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeroArticleCard } from '../components/HeroArticleCard';
import { ArticleListItem } from '../components/ArticleListItem';
import { NewsArticleItem } from '../types/news.types';
import { router } from 'expo-router';

const MOCK_FEATURED_ARTICLE: NewsArticleItem = {
  id: 'feat-1',
  title: '2027 EV Battery Breakthrough Explained',
  slug: '2027-ev-battery-breakthrough-explained',
  category: 'Electric',
  summary:
    'Solid-state batteries have long been described as the next great leap for electric cars. A new manufacturing process may finally make that promise practical at scale.',
  coverImage:
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  authorName: 'Amelia Morgan',
  publishedDate: 'August 25, 2026',
  readTime: '4 min read',
  isFeatured: true,
};

const MOCK_LATEST_ARTICLES: NewsArticleItem[] = [
  {
    id: 'art-1',
    title: 'The family SUV finally gets smarter',
    slug: 'family-suv-gets-smarter',
    category: 'First Drives',
    summary:
      'We test drive the latest hybrid crossover arriving in the Middle East with level-3 autonomous parking and active suspension.',
    coverImage:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    authorName: 'Tarek Al-Mansoor',
    publishedDate: 'Aug 22, 2026',
    readTime: '3 min read',
  },
  {
    id: 'art-2',
    title: 'Five compact EVs worth waiting for',
    slug: 'five-compact-evs-worth-waiting-for',
    category: 'Electric',
    summary:
      'From sub-$25k city hatchbacks to long-range AWD crossovers, here are the most anticipated electric cars launching next year.',
    coverImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    authorName: 'Amelia Morgan',
    publishedDate: 'Aug 20, 2026',
    readTime: '5 min read',
  },
  {
    id: 'art-3',
    title: 'Egyptian Automotive Market: Q3 Price Overview',
    slug: 'egypt-market-q3-price-overview',
    category: 'Price Tracker',
    summary:
      'Official MSRP changes vs. dealer overprice adjustments across Cairo showrooms for top sedan and crossover trims.',
    coverImage:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    authorName: 'Hassan Sherif',
    publishedDate: 'Aug 18, 2026',
    readTime: '6 min read',
  },
];

const CATEGORIES = ['All', 'First Drives', 'Industry News', 'Electric', 'Price Tracker'];

export const NewsScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const handleArticlePress = (article: NewsArticleItem) => {
    router.push({
      pathname: '/news/[slug]',
      params: { slug: article.slug },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Row */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.editorialTag}>AUTOVERSUS EDITORIAL</Text>
          <Text style={styles.headerTitle}>Automotive News & Reviews</Text>
        </View>

        <TouchableOpacity style={styles.searchIconButton} activeOpacity={0.7}>
          <Ionicons name="search" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Hero Featured Article Card */}
        <HeroArticleCard
          article={MOCK_FEATURED_ARTICLE}
          onPress={() => handleArticlePress(MOCK_FEATURED_ARTICLE)}
        />

        {/* Latest Stories Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Latest Stories</Text>
          <Text style={styles.articleCount}>{MOCK_LATEST_ARTICLES.length} articles</Text>
        </View>

        {/* Vertical List of News Items */}
        <View style={styles.listContainer}>
          {MOCK_LATEST_ARTICLES.map((article) => (
            <ArticleListItem
              key={article.id}
              article={article}
              onPress={() => handleArticlePress(article)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  editorialTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F2942',
  },
  searchIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  chipActive: {
    backgroundColor: '#0F2942',
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: '#6B7280',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F2942',
  },
  articleCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
});
