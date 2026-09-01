import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeroArticleCard } from '../components/HeroArticleCard';
import { ArticleListItem } from '../components/ArticleListItem';
import { NewsArticleItem } from '../types/news.types';
import { router } from 'expo-router';
import {
  SHIFT_FEATURED_ARTICLE,
  SHIFT_ARTICLES_LIST,
  ShiftNewsArticle,
  getLocalizedArticle,
} from '../data/shift-news.data';
import { useLanguage } from '../../../shared/context/LanguageContext';

export const NewsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { key: 'ALL', label: language === 'EN' ? 'All' : 'الكل' },
    { key: 'LOCAL', label: language === 'EN' ? 'Local' : 'محلية' },
    { key: 'PRICES', label: language === 'EN' ? 'Car Prices' : 'أسعار السيارات' },
    { key: 'GLOBAL', label: language === 'EN' ? 'Global' : 'عالمية' },
    { key: 'TECH', label: language === 'EN' ? 'Technology' : 'تكنولوجيا' },
    { key: 'REPORTS', label: language === 'EN' ? 'Reports' : 'تقارير' },
  ];

  const featuredArticle = getLocalizedArticle(SHIFT_FEATURED_ARTICLE, language);

  const localizedArticles = SHIFT_ARTICLES_LIST.map((art) =>
    getLocalizedArticle(art, language)
  );

  const filteredArticles =
    activeCategory === 'ALL'
      ? localizedArticles
      : localizedArticles.filter((art) => {
          if (activeCategory === 'LOCAL') return art.categoryEn === 'Local News';
          if (activeCategory === 'PRICES') return art.categoryEn === 'Car Prices';
          if (activeCategory === 'GLOBAL') return art.categoryEn === 'Global News';
          if (activeCategory === 'TECH') return art.categoryEn === 'Technology';
          if (activeCategory === 'REPORTS') return art.categoryEn === 'Reports';
          return true;
        });

  const handleArticlePress = (article: ShiftNewsArticle | NewsArticleItem) => {
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
          <Text style={styles.editorialTag}>{t('news.editorialTag')}</Text>
          <Text style={styles.headerTitle}>{t('news.headerTitle')}</Text>
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
          {categories.map((cat) => {
            const isActive = cat.key === activeCategory;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
                onPress={() => setActiveCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Hero Featured Article Card */}
        <HeroArticleCard
          article={featuredArticle}
          onPress={() => handleArticlePress(featuredArticle)}
        />

        {/* Latest Stories Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('news.latestStories')}</Text>
          <Text style={styles.articleCount}>{filteredArticles.length} {t('news.articlesCount')}</Text>
        </View>

        {/* Vertical List of News Items */}
        <View style={styles.listContainer}>
          {filteredArticles.map((article) => (
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
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  editorialTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C92A2A',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
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
    paddingBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#0F2942',
  },
  chipInactive: {
    backgroundColor: '#F3F4F6',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: '#4B5563',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F2942',
  },
  articleCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
});
