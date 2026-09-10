import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  SHIFT_FEATURED_ARTICLE,
  SHIFT_ARTICLES_LIST,
  ShiftNewsArticle,
  getLocalizedArticle,
} from '../../news/data/shift-news.data';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { useAuthStore } from '../../identity/store/auth.store';

export interface NewsArticleCardItem {
  id: string;
  title: string;
  category: string;
  publishedDate: string;
  readTime: string;
  coverImage: string;
  slug: string;
}

const HOME_NEWS_ARTICLES: ShiftNewsArticle[] = [
  SHIFT_FEATURED_ARTICLE,
  ...SHIFT_ARTICLES_LIST,
];

interface LatestNewsCardProps {
  rawArticle: ShiftNewsArticle;
  language: 'EN' | 'AR';
  isBookmarked: boolean;
  onArticlePress?: (article: ShiftNewsArticle | NewsArticleCardItem) => void;
  onToggleBookmark: (id: string) => void;
}

const LatestNewsCard: React.FC<LatestNewsCardProps> = React.memo(
  ({ rawArticle, language, isBookmarked, onArticlePress, onToggleBookmark }) => {
    const article = getLocalizedArticle(rawArticle, language);
    const categoryText = (article.category || 'NEWS').toUpperCase();

    return (
      <TouchableOpacity
        testID={`home-news-card-${article.id}`}
        accessibilityLabel={`Read article ${article.title}`}
        style={styles.card}
        onPress={() => onArticlePress?.(article)}
        activeOpacity={0.9}
      >
        {/* Cover Image Container */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: article.coverImage }} style={styles.articleImage} />

          {/* Category Badge Pill */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryText}</Text>
          </View>

          {/* Floating Bookmark Button */}
          <TouchableOpacity
            testID={`home-news-bookmark-${article.id}`}
            accessibilityLabel={`Bookmark article ${article.title}`}
            style={styles.bookmarkButton}
            onPress={() => onToggleBookmark(article.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isBookmarked ? '#C92A2A' : '#111827'}
            />
          </TouchableOpacity>
        </View>

        {/* Card Footer Info */}
        <View style={styles.cardBody}>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.metaText}>
            {article.publishedDate} · {article.readTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

interface LatestNewsListProps {
  onSeeAllPress?: () => void;
  onArticlePress?: (article: ShiftNewsArticle | NewsArticleCardItem) => void;
}

export const LatestNewsList: React.FC<LatestNewsListProps> = ({
  onSeeAllPress,
  onArticlePress,
}) => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuthStore();
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleBookmark = useCallback(
    (id: string) => {
      if (!isAuthenticated) {
        Alert.alert(
          'Sign In Required',
          'You need to sign in or create an account to save news articles.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign In',
              onPress: () => router.push('/auth'),
            },
          ]
        );
        return;
      }
      setBookmarkedIds((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    [isAuthenticated]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ShiftNewsArticle>) => {
      const isBookmarked = !!bookmarkedIds[item.id];
      return (
        <LatestNewsCard
          rawArticle={item}
          language={language}
          isBookmarked={isBookmarked}
          onArticlePress={onArticlePress}
          onToggleBookmark={toggleBookmark}
        />
      );
    },
    [bookmarkedIds, language, onArticlePress, toggleBookmark]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 286,
      offset: 286 * index,
      index,
    }),
    []
  );

  return (
    <View nativeID="home-latest-news-container" testID="home-latest-news-container" style={styles.container}>
      {/* Section Header */}
      <View nativeID="home-latest-news-header" style={styles.headerRow}>
        <View>
          <Text style={styles.newsLabel}>{t('news.editorialTag')}</Text>
          <Text style={styles.title}>{t('home.latestNews')}</Text>
        </View>
        <TouchableOpacity
          testID="home-see-all-news-button"
          accessibilityLabel="See All News Articles"
          onPress={onSeeAllPress}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel List */}
      <FlatList
        nativeID="home-latest-news-scrollview"
        testID="home-latest-news-scrollview"
        horizontal
        data={HOME_NEWS_ARTICLES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C92A2A',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F2942',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C92A2A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  articleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#C92A2A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardBody: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 21,
    marginBottom: 8,
    textAlign: 'right',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
});
