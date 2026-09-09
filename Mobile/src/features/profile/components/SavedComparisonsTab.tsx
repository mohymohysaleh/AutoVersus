import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SavedComparisonItem } from '../types/profile.types';
import { useSavedStore } from '../store/saved.store';

export const SavedComparisonsTab: React.FC = () => {
  const savedComparisons = useSavedStore((state) => state.savedComparisons);
  const removeSavedComparison = useSavedStore((state) => state.removeSavedComparison);

  const handleOpenComparison = (comparison: SavedComparisonItem) => {
    router.push({
      pathname: '/(tabs)/compare',
      params: { carSlugs: comparison.variantSlugs.join(',') },
    });
  };

  if (savedComparisons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="swap-horizontal-outline" size={32} color="#64748B" />
        </View>
        <Text style={styles.emptyTitle}>No Saved Comparisons</Text>
        <Text style={styles.emptySubtitle}>
          Compare cars in the AutoVersus Spec Battle and tap 'Save Results' to store your custom vehicle matchups here.
        </Text>
        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => router.push('/(tabs)/compare')}
          activeOpacity={0.8}
        >
          <Text style={styles.compareButtonText}>Compare Cars Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={savedComparisons}
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
            <View style={styles.headerTitleRow}>
              <Text style={styles.titleText} numberOfLines={2}>
                {item.title}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeSavedComparison(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F2942',
    lineHeight: 22,
  },
  deleteButton: {
    padding: 4,
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

  /* Empty state styles */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F2942',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  compareButton: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  compareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
