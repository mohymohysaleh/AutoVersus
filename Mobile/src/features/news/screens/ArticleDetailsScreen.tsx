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

interface ArticleDetailsScreenProps {
  slug?: string;
}

export const ArticleDetailsScreen: React.FC<ArticleDetailsScreenProps> = ({ slug }) => {
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

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
            source={{
              uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </View>

        {/* Overlapping Article Sheet */}
        <View style={styles.articleSheet}>
          {/* Category Red Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>ELECTRIC</Text>
          </View>

          {/* Article Title */}
          <Text style={[styles.articleTitle, { fontSize: 26 * fontSizeMultiplier }]}>
            2027 EV Battery Breakthrough Explained
          </Text>

          {/* Author & Meta Row */}
          <View style={styles.authorRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AM</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>Amelia Morgan</Text>
              <Text style={styles.metaText}>August 25, 2026 · 4 min read</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Article Lead Paragraph */}
          <Text style={[styles.leadParagraph, { fontSize: 16 * fontSizeMultiplier }]}>
            Solid-state batteries have long been described as the next great leap for electric cars. A new
            manufacturing process may finally make that promise practical at scale.
          </Text>

          {/* Section Subheading */}
          <Text style={[styles.subheading, { fontSize: 20 * fontSizeMultiplier }]}>
            More range, less waiting
          </Text>

          {/* Article Body Paragraph */}
          <Text style={[styles.bodyParagraph, { fontSize: 16 * fontSizeMultiplier }]}>
            The new cells replace the liquid electrolyte found in today's lithium-ion packs with a stable
            solid layer. Engineers say this allows more energy to fit into a smaller package while
            improving heat management and reducing charging times by over 60 percent.
          </Text>

          {/* Article Body Paragraph 2 */}
          <Text style={[styles.bodyParagraph, { fontSize: 16 * fontSizeMultiplier }]}>
            In early trials with prototype electric sedans, testing demonstrated continuous ranges exceeding
            850 kilometers on a single charge. Regional automakers in MENA and Europe are already preparing
            pilot integration for model year 2027.
          </Text>
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
    flexDirection: 'row',
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
    marginRight: 12,
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
    fontWeight: '500',
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
    marginBottom: 16,
  },
});
