import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CarItem } from '../types/catalog.types';
import { useAuthStore } from '../../identity/store/auth.store';

interface CarGridCardProps {
  car: CarItem;
  onPress?: () => void;
}

export const CarGridCard: React.FC<CarGridCardProps> = ({ car, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(car.imageUrl);
  const { isAuthenticated } = useAuthStore();

  const handleFavoritePress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'You need to sign in or create an account to save cars to your garage.',
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
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableOpacity
      testID={`catalog-car-grid-card-${car.id}`}
      accessibilityLabel={`View details for ${car.brand} ${car.model}`}
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View nativeID={`catalog-car-image-container-${car.id}`} style={styles.imageContainer}>
        <Image
          source={{ uri: imgSrc }}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80');
          }}
        />

        {/* Favorite Floating Heart Button */}
        <TouchableOpacity
          testID={`catalog-favorite-button-${car.id}`}
          accessibilityLabel={`Favorite ${car.model}`}
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#EF4444' : '#111827'}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View nativeID={`catalog-car-card-body-${car.id}`} style={styles.content}>
        {/* Brand Tag */}
        <Text style={styles.brandTag}>{car.brand.toUpperCase()}</Text>

        {/* Car Name */}
        <Text style={styles.carTitle} numberOfLines={2}>
          {car.model} {car.trimName}
        </Text>

        {/* Price Tag */}
        <Text style={styles.price}>{car.price}</Text>

        {/* Spec Pill Badges */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{car.category}</Text>
          </View>
          {car.rangeKm ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{car.rangeKm} km</Text>
            </View>
          ) : car.fuelConsumption ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{car.fuelConsumption}</Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{car.seats} Seats</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 12,
  },
  brandTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  carTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 20,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C92A2A', // Accent red from design
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
});
