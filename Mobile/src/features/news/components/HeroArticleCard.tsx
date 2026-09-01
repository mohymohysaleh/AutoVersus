import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NewsArticleItem } from '../types/news.types';
import { ShiftNewsArticle } from '../data/shift-news.data';

interface HeroArticleCardProps {
  article: NewsArticleItem | ShiftNewsArticle;
  onPress?: () => void;
}

export const HeroArticleCard: React.FC<HeroArticleCardProps> = ({ article, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Hero Cover Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: article.coverImage }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Red Category Pill */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Meta Row */}
        <Text style={styles.metaText}>
          {article.publishedDate} · {article.readTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginHorizontal: 20,
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#111827',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C92A2A', // Accent red badge
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F2942',
    lineHeight: 28,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});
