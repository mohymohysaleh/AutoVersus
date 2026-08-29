import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SavedComparisonItem } from '../types/profile.types';
import { router } from 'expo-router';

const MOCK_COMPARISONS: SavedComparisonItem[] = [
  {
    id: 'comp-1',
    title: 'Range Rover Velar vs Hyundai IONIQ 6',
    createdDate: 'Created Aug 22, 2026',
    leftCarImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    rightCarImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    variantSlugs: ['range-rover-velar', 'hyundai-ioniq-6-limited'],
  },
  {
    id: 'comp-2',
    title: 'BMW M3 vs Porsche Taycan 4S',
    createdDate: 'Created Aug 14, 2026',
    leftCarImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    rightCarImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    variantSlugs: ['bmw-m3-competition', 'porsche-taycan-4s'],
  },
];

export const SavedComparisonsTab: React.FC = () => {
  const handleOpenComparison = (comparison: SavedComparisonItem) => {
    router.push('/(tabs)/compare');
  };

  return (
    <FlatList
      data={MOCK_COMPARISONS}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* Dual Side-by-Side Car Images */}
          <View style={styles.imagesRow}>
            <View style={styles.halfImageContainer}>
              <Image source={{ uri: item.leftCarImage }} style={styles.carImage} resizeMode="cover" />
            </View>
            <View style={styles.halfImageContainer}>
              <Image source={{ uri: item.rightCarImage }} style={styles.carImage} resizeMode="cover" />
            </View>
          </View>

          {/* Details */}
          <View style={styles.cardBody}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.dateText}>{item.createdDate}</Text>

            {/* Open Comparison Button */}
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => handleOpenComparison(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.openButtonText}>Open Comparison</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  halfImageContainer: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    gap: 6,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F2942',
    lineHeight: 22,
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  openButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F2942',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
  },
});
