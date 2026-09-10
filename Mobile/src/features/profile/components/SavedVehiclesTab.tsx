import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform, ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSavedStore } from '../store/saved.store';
import { SavedVehicle } from '../types/profile.types';
import { OptimizedImage } from '../../../shared/components/OptimizedImage';

interface SavedVehicleCardProps {
  item: SavedVehicle;
  onPress: (slug: string) => void;
  onRemove: (id: string) => void;
}

const SavedVehicleCard: React.FC<SavedVehicleCardProps> = React.memo(({ item, onPress, onRemove }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.slug)}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <OptimizedImage uri={item.imageUrl} style={styles.image} contentFit="cover" />

        {/* Filled Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => onRemove(item.id)}
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
  );
});

export const SavedVehiclesTab: React.FC = () => {
  const savedVehicles = useSavedStore((state) => state.savedVehicles);
  const removeSavedVehicle = useSavedStore((state) => state.removeSavedVehicle);

  const handleCardPress = useCallback((slug: string) => {
    router.push({
      pathname: '/car/[slug]',
      params: { slug },
    });
  }, []);

  const handleRemoveVehicle = useCallback(
    (id: string) => {
      removeSavedVehicle(id);
    },
    [removeSavedVehicle]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SavedVehicle>) => (
      <SavedVehicleCard item={item} onPress={handleCardPress} onRemove={handleRemoveVehicle} />
    ),
    [handleCardPress, handleRemoveVehicle]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 200,
      offset: 200 * index,
      index,
    }),
    []
  );

  if (savedVehicles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="heart-outline" size={32} color="#64748B" />
        </View>
        <Text style={styles.emptyTitle}>No Saved Vehicles</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart icon on any car card or spec sheet to save it to your personal garage.
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.8}
        >
          <Text style={styles.browseButtonText}>Browse Vehicle Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={savedVehicles}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews={Platform.OS === 'android'}
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
  browseButton: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
