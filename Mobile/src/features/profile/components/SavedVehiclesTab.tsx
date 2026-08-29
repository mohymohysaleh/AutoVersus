import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedVehicle } from '../types/profile.types';
import { router } from 'expo-router';

const MOCK_SAVED_VEHICLES: SavedVehicle[] = [
  {
    id: '1',
    name: 'Range Rover Velar',
    price: 'From EGP 4,200,000',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    slug: 'range-rover-velar',
  },
  {
    id: '2',
    name: 'Hyundai IONIQ 6',
    price: 'From EGP 2,450,000',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    slug: 'hyundai-ioniq-6-limited',
  },
  {
    id: '3',
    name: 'BMW M3 Competition',
    price: 'From EGP 5,200,000',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    slug: 'bmw-m3-competition',
  },
  {
    id: '4',
    name: 'Porsche Taycan 4S',
    price: 'From EGP 5,450,000',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    slug: 'porsche-taycan-4s',
  },
  {
    id: '5',
    name: 'City EV Touring',
    price: 'From EGP 1,280,000',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    slug: 'city-ev-touring',
  },
  {
    id: '6',
    name: 'Family Hybrid AWD',
    price: 'From EGP 1,850,000',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    slug: 'family-hybrid-awd',
  },
];

export const SavedVehiclesTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>(MOCK_SAVED_VEHICLES);

  const toggleRemove = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const handleCardPress = (slug: string) => {
    router.push({
      pathname: '/car/[slug]',
      params: { slug },
    });
  };

  return (
    <FlatList
      data={vehicles}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleCardPress(item.slug)}
          activeOpacity={0.9}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

            {/* Filled Heart Button */}
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => toggleRemove(item.id)}
              activeOpacity={0.8}
            >
              <Ionicons name="heart" size={18} color="#C92A2A" />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.cardBody}>
            <Text style={styles.carName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
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
  heartButton: {
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
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: {
    padding: 14,
  },
  carName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C92A2A',
  },
});
