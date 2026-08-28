import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TrendingCarItem {
  id: string;
  name: string;
  subTitle: string;
  price: string;
  imageUrl: string;
  slug: string;
}

const TRENDING_CARS: TrendingCarItem[] = [
  {
    id: '1',
    name: 'Range Rover Velar',
    subTitle: 'Dynamic SE',
    price: 'From EGP 4,200,000',
    imageUrl:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    slug: 'range-rover-velar-dynamic-se',
  },
  {
    id: '2',
    name: 'Hyundai Ioniq 6',
    subTitle: 'Limited AWD',
    price: 'From EGP 2,450,000',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    slug: 'hyundai-ioniq-6-limited',
  },
  {
    id: '3',
    name: 'Toyota Corolla',
    subTitle: 'Active Comfort',
    price: 'From EGP 1,450,000',
    imageUrl:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    slug: 'toyota-corolla-comfort',
  },
  {
    id: '4',
    name: 'BMW 320i',
    subTitle: 'M Sport Edition',
    price: 'From EGP 3,800,000',
    imageUrl:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    slug: 'bmw-320i-m-sport',
  },
];

interface TrendingCarsListProps {
  onSeeAllPress?: () => void;
  onCarPress?: (car: TrendingCarItem) => void;
}

export const TrendingCarsList: React.FC<TrendingCarsListProps> = ({
  onSeeAllPress,
  onCarPress,
}) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.popularLabel}>POPULAR NOW</Text>
          <Text style={styles.title}>Trending Cars</Text>
        </View>
        <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TRENDING_CARS.map((car) => {
          const isBookmarked = !!bookmarkedIds[car.id];
          return (
            <TouchableOpacity
              key={car.id}
              style={styles.card}
              onPress={() => onCarPress?.(car)}
              activeOpacity={0.9}
            >
              {/* Car Image Container */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: car.imageUrl }} style={styles.carImage} />

                {/* Floating Bookmark Button */}
                <TouchableOpacity
                  style={styles.bookmarkButton}
                  onPress={() => toggleBookmark(car.id)}
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
                <Text style={styles.carName} numberOfLines={1}>
                  {car.name}
                </Text>
                <Text style={styles.subTitle} numberOfLines={1}>
                  {car.subTitle}
                </Text>
                <Text style={styles.priceText}>{car.price}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  popularLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C92A2A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 250,
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
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  carName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C92A2A',
  },
});
