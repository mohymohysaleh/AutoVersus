import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NewsArticleItem } from '../types/news.types';
import { ShiftNewsArticle } from '../data/shift-news.data';
import { useAuthStore } from '../../identity/store/auth.store';

interface ArticleListItemProps {
  article: NewsArticleItem | ShiftNewsArticle;
  onPress?: () => void;
}

export const ArticleListItem: React.FC<ArticleListItemProps> = ({ article, onPress }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgSrc, setImgSrc] = useState(article.coverImage);
  const { isAuthenticated } = useAuthStore();

  const handleBookmarkPress = () => {
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
    setIsBookmarked(!isBookmarked);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Left Thumbnail Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: imgSrc || article.coverImage,
            headers: {
              Referer: 'https://www.shift-eg.com/',
            },
          }}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80');
          }}
        />
      </View>

      {/* Right Content */}
      <View style={styles.contentContainer}>
        <View>
          {/* Uppercase Category Tag */}
          <Text style={styles.categoryTag}>{(article.category || 'News').toUpperCase()}</Text>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
        </View>

        {/* Bottom Date & Bookmark Row */}
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>{article.publishedDate}</Text>

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmarkPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isBookmarked ? '#C92A2A' : '#6B7280'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  imageContainer: {
    width: 110,
    height: 85,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    height: 85,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 2,
  },
});
