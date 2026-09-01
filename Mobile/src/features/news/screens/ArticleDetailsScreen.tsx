import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  SHIFT_FEATURED_ARTICLE,
  SHIFT_ARTICLES_LIST,
  ShiftNewsArticle,
  getLocalizedArticle,
} from '../data/shift-news.data';
import { useLanguage } from '../../../shared/context/LanguageContext';

interface ArticleDetailsScreenProps {
  slug?: string;
}

export const ArticleDetailsScreen: React.FC<ArticleDetailsScreenProps> = ({ slug }) => {
  const { t, language } = useLanguage();
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  // Find article by slug or fallback to featured Shift-EG article
  const rawArticle: ShiftNewsArticle =
    [SHIFT_FEATURED_ARTICLE, ...SHIFT_ARTICLES_LIST].find((a) => a.slug === slug) ||
    SHIFT_FEATURED_ARTICLE;

  const article = getLocalizedArticle(rawArticle, language);
  const isEn = language === 'EN';

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/news');
    }
  };

  const toggleFontSize = () => {
    setFontSizeMultiplier((prev) => (prev === 1 ? 1.15 : 1));
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Floating Header Buttons Bar */}
      <SafeAreaView style={styles.floatingHeaderSafeArea}>
        <View style={styles.floatingHeader}>
          {/* Back Button */}
          <TouchableOpacity style={styles.iconCircleButton} onPress={handleBack} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>

          {/* Right Action Icons */}
          <View style={styles.rightHeaderActions}>
            <TouchableOpacity style={styles.readerPillButton} onPress={toggleFontSize} activeOpacity={0.8}>
              <Text style={styles.readerPillText}>T A+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconCircleButton} activeOpacity={0.8}>
              <Ionicons name="share-outline" size={20} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable Article Body */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Full-Bleed Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: article.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </View>

        {/* Overlapping Article Sheet */}
        <View style={styles.articleSheet}>
          {/* Category Red Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{(article.category || 'NEWS').toUpperCase()}</Text>
          </View>

          {/* Article Title */}
          <Text style={[styles.articleTitle, { fontSize: 24 * fontSizeMultiplier, textAlign: isEn ? 'left' : 'right' }]}>
            {article.title}
          </Text>

          {/* Author & Meta Row */}
          <View style={[styles.authorRow, { flexDirection: isEn ? 'row' : 'row-reverse' }]}>
            <View style={[styles.avatarCircle, isEn ? { marginRight: 12 } : { marginLeft: 12 }]}>
              <Text style={styles.avatarText}>{getInitials(article.authorName || 'SE')}</Text>
            </View>
            <View style={[styles.authorInfo, { alignItems: isEn ? 'flex-start' : 'flex-end' }]}>
              <Text style={styles.authorName}>{article.authorName}</Text>
              <Text style={styles.metaText}>{article.publishedDate} · {article.readTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Article Lead Paragraph */}
          <Text style={[styles.leadParagraph, { fontSize: 16 * fontSizeMultiplier, textAlign: isEn ? 'left' : 'right' }]}>
            {article.summary}
          </Text>

          {/* Section Subheading */}
          <Text style={[styles.subheading, { fontSize: 19 * fontSizeMultiplier, textAlign: isEn ? 'left' : 'right' }]}>
            {isEn ? 'Full Coverage & Details' : 'التفاصيل والتغطية الصحفية'}
          </Text>

          {/* Article Body Paragraph */}
          <Text style={[styles.bodyParagraph, { fontSize: 16 * fontSizeMultiplier, textAlign: isEn ? 'left' : 'right' }]}>
            {article.fullContent}
          </Text>

          {/* Source Attribution Badge */}
          <View style={styles.sourceBox}>
            <Text style={styles.sourceBoxText}>{t('news.sourceTag')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingHeaderSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  floatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  readerPillButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  readerPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F2942',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverImageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#111827',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  articleSheet: {
    marginTop: -28,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C92A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  articleTitle: {
    fontWeight: '800',
    color: '#0F2942',
    lineHeight: 34,
    marginBottom: 20,
  },
  authorRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  authorInfo: {
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 24,
  },
  leadParagraph: {
    fontWeight: '600',
    color: '#374151',
    lineHeight: 26,
    marginBottom: 24,
  },
  subheading: {
    fontWeight: '800',
    color: '#0F2942',
    marginBottom: 12,
  },
  bodyParagraph: {
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 20,
  },
  sourceBox: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  sourceBoxText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
});
