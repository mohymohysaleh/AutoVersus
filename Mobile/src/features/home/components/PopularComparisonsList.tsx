import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '../../../shared/context/LanguageContext';

export interface PopularComparisonItem {
  id: string;
  badgeTag: string;
  leftCar: {
    name: string;
    trim: string;
    imageUrl: string;
    slug: string;
    hp: string;
  };
  rightCar: {
    name: string;
    trim: string;
    imageUrl: string;
    slug: string;
    hp: string;
  };
}

const POPULAR_COMPARISONS: PopularComparisonItem[] = [
  {
    id: 'comp-1',
    badgeTag: 'POPULAR SEDAN BATTLE',
    leftCar: {
      name: 'Toyota Corolla',
      trim: '1.6L Comfort',
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      slug: 'toyota-corolla-comfort',
      hp: '139 HP',
    },
    rightCar: {
      name: 'MG 6',
      trim: '1.5T Luxury',
      imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      slug: 'mg-mg-6-luxury',
      hp: '169 HP',
    },
  },
  {
    id: 'comp-2',
    badgeTag: 'ULTIMATE SUV MATCH',
    leftCar: {
      name: 'Hyundai Tucson',
      trim: '1.6T N-Line',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      slug: 'hyundai-tucson-facelift',
      hp: '180 HP',
    },
    rightCar: {
      name: 'Kia Sportage',
      trim: '1.6T GT-Line',
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      slug: 'kia-sportage-gt-line',
      hp: '180 HP',
    },
  },
  {
    id: 'comp-3',
    badgeTag: 'HYBRID VS TURBO',
    leftCar: {
      name: 'Geely Monjaro',
      trim: 'EM-i Hybrid',
      imageUrl: 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=800&q=80',
      slug: 'geely-monjaro-emi-hybrid',
      hp: '240 HP',
    },
    rightCar: {
      name: 'Chery Tiggo 7',
      trim: 'Pro Max',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      slug: 'chery-tiggo-7-pro-max',
      hp: '156 HP',
    },
  },
  {
    id: 'comp-4',
    badgeTag: 'LUXURY SHOWDOWN',
    leftCar: {
      name: 'Range Rover Velar',
      trim: 'Dynamic SE',
      imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
      slug: 'range-rover-velar-dynamic-se',
      hp: '249 HP',
    },
    rightCar: {
      name: 'BMW 320i',
      trim: 'M Sport',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      slug: 'bmw-320i-m-sport',
      hp: '184 HP',
    },
  },
];

interface PopularComparisonCardProps {
  item: PopularComparisonItem;
  isAr: boolean;
  onPress: (item: PopularComparisonItem) => void;
}

const PopularComparisonCard: React.FC<PopularComparisonCardProps> = React.memo(
  ({ item, isAr, onPress }) => {
    return (
      <TouchableOpacity
        testID={`home-comparison-card-${item.id}`}
        accessibilityLabel={`Compare ${item.leftCar.name} vs ${item.rightCar.name}`}
        style={styles.card}
        onPress={() => onPress(item)}
        activeOpacity={0.9}
      >
        {/* Top Tag Pill */}
        <View style={styles.tagPill}>
          <Ionicons name="flash-sharp" size={11} color="#C92A2A" style={{ marginRight: 4 }} />
          <Text style={styles.tagPillText}>{item.badgeTag}</Text>
        </View>

        {/* Dual Car Visuals Grid */}
        <View style={styles.dualCarRow}>
          {/* Left Car */}
          <View style={styles.singleCarCol}>
            <View style={styles.carImageWrapper}>
              <Image source={{ uri: item.leftCar.imageUrl }} style={styles.carImg} />
              <View style={styles.hpBadge}>
                <Text style={styles.hpBadgeText}>{item.leftCar.hp}</Text>
              </View>
            </View>
            <Text style={styles.carName} numberOfLines={1}>
              {item.leftCar.name}
            </Text>
            <Text style={styles.carTrim} numberOfLines={1}>
              {item.leftCar.trim}
            </Text>
          </View>

          {/* VS Badge Divider */}
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Right Car */}
          <View style={styles.singleCarCol}>
            <View style={styles.carImageWrapper}>
              <Image source={{ uri: item.rightCar.imageUrl }} style={styles.carImg} />
              <View style={styles.hpBadge}>
                <Text style={styles.hpBadgeText}>{item.rightCar.hp}</Text>
              </View>
            </View>
            <Text style={styles.carName} numberOfLines={1}>
              {item.rightCar.name}
            </Text>
            <Text style={styles.carTrim} numberOfLines={1}>
              {item.rightCar.trim}
            </Text>
          </View>
        </View>

        {/* Bottom Action Button */}
        <View style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>
            {isAr ? 'مقارنة المواصفات الان' : 'Compare Specs'}
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#0F2942" />
        </View>
      </TouchableOpacity>
    );
  }
);

interface PopularComparisonsListProps {
  onSeeAllPress?: () => void;
}

export const PopularComparisonsList: React.FC<PopularComparisonsListProps> = ({
  onSeeAllPress,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'AR';

  const handleComparisonPress = useCallback((item: PopularComparisonItem) => {
    const slugs = `${item.leftCar.slug},${item.rightCar.slug}`;
    router.push({
      pathname: '/(tabs)/compare',
      params: { carSlugs: slugs, clear: 'false', reset: 'false', ts: Date.now().toString() },
    });
  }, []);

  const handleHeaderComparePress = useCallback(() => {
    if (onSeeAllPress) {
      onSeeAllPress();
    } else {
      router.push({
        pathname: '/(tabs)/compare',
        params: { clear: 'true', reset: 'true', carSlugs: '', ts: Date.now().toString() },
      });
    }
  }, [onSeeAllPress]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PopularComparisonItem>) => (
      <PopularComparisonCard
        item={item}
        isAr={isAr}
        onPress={handleComparisonPress}
      />
    ),
    [isAr, handleComparisonPress]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 306,
      offset: 306 * index,
      index,
    }),
    []
  );

  return (
    <View nativeID="home-popular-comparisons-container" testID="home-popular-comparisons-container" style={styles.container}>
      {/* Section Header */}
      <View nativeID="home-popular-comparisons-header" style={styles.headerRow}>
        <View>
          <Text style={styles.sectionBadge}>
            {isAr ? 'مقارنات رائجة' : 'HEAD-TO-HEAD BATTLES'}
          </Text>
          <Text style={styles.title}>
            {isAr ? 'مقارنات السيارات' : 'Popular Comparisons'}
          </Text>
        </View>
        <TouchableOpacity
          testID="home-see-all-comparisons-button"
          accessibilityLabel="See All Comparisons"
          onPress={handleHeaderComparePress}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>
            {isAr ? 'عرض الكل' : 'Compare'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel List */}
      <FlatList
        nativeID="home-popular-comparisons-scrollview"
        testID="home-popular-comparisons-scrollview"
        horizontal
        data={POPULAR_COMPARISONS}
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
  sectionBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F2942',
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
    width: 290,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C92A2A',
    letterSpacing: 0.6,
  },
  dualCarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 14,
  },
  singleCarCol: {
    width: '46%',
    alignItems: 'center',
  },
  carImageWrapper: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  carImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hpBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(15, 41, 66, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hpBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  carName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  carTrim: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  vsCircle: {
    position: 'absolute',
    left: '50%',
    top: 30,
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  vsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F2942',
  },
});
