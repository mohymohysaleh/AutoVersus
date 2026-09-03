import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonCar } from '../types/comparison.types';

interface StickyHeaderProps {
  cars: ComparisonCar[];
  winnerCarId?: string;
  onAddCarPress: () => void;
  onSwapCarPress: (index: number) => void;
  onRemoveCarPress: (index: number) => void;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  cars,
  winnerCarId,
  onAddCarPress,
  onSwapCarPress,
  onRemoveCarPress,
}) => {
  const showEmptySlot1 = cars.length === 0;
  const showEmptySlot2 = cars.length <= 1;
  const showEmptySlot3 = cars.length === 2;

  return (
    <View style={styles.container}>
      <View style={styles.columnsRow}>
        {/* Render filled car slots */}
        {cars.map((car, index) => {
          const isWinner = Boolean(winnerCarId) && car.id === winnerCarId;
          return (
            <View
              key={car.id || index}
              style={[styles.carSlot, isWinner ? styles.winnerCarSlot : null]}
            >
              {/* Winner Crown Badge */}
              {isWinner ? (
                <View style={styles.winnerCrownTag}>
                  <Ionicons name="trophy" size={10} color="#D97706" />
                  <Text style={styles.winnerCrownText}>WINNER</Text>
                </View>
              ) : null}

              {/* Remove car icon if 2+ cars */}
              <TouchableOpacity
                style={styles.removeBadge}
                onPress={() => onRemoveCarPress(index)}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Thumbnail */}
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={() => onSwapCarPress(index)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: car.imageUrl }} style={styles.carImage} resizeMode="cover" />
                <View style={styles.swapBadge}>
                  <Ionicons name="swap-horizontal" size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* Title & Trim */}
              <Text style={styles.carName} numberOfLines={1}>
                {car.brandName} {car.modelName}
              </Text>
              <Text style={styles.carTrim} numberOfLines={1}>
                {car.year} {car.trimName}
              </Text>

              {/* Price highlighted in #C4342B */}
              <Text style={styles.priceText} numberOfLines={1}>
                EGP {(car.startingPriceEGP / 1000000).toFixed(2)}M
              </Text>
            </View>
          );
        })}

        {/* Empty Slot 1 (if 0 cars) */}
        {showEmptySlot1 ? (
          <TouchableOpacity
            style={styles.addCarSlot}
            onPress={onAddCarPress}
            activeOpacity={0.8}
          >
            <View style={styles.plusCircle}>
              <Ionicons name="add" size={24} color="#0F3040" />
            </View>
            <Text style={styles.addSlotText}>Select 1st Car</Text>
            <Text style={styles.addSlotSub}>Tap to pick vehicle</Text>
          </TouchableOpacity>
        ) : null}

        {/* Empty Slot 2 (if <= 1 cars) */}
        {showEmptySlot2 ? (
          <TouchableOpacity
            style={styles.addCarSlot}
            onPress={onAddCarPress}
            activeOpacity={0.8}
          >
            <View style={styles.plusCircle}>
              <Ionicons name="add" size={24} color="#0F3040" />
            </View>
            <Text style={styles.addSlotText}>Select 2nd Car</Text>
            <Text style={styles.addSlotSub}>Tap to pick vehicle</Text>
          </TouchableOpacity>
        ) : null}

        {/* Empty Slot 3 (if exactly 2 cars) */}
        {showEmptySlot3 ? (
          <TouchableOpacity
            style={styles.addCarSlot}
            onPress={onAddCarPress}
            activeOpacity={0.8}
          >
            <View style={styles.plusCircle}>
              <Ionicons name="add" size={24} color="#0F3040" />
            </View>
            <Text style={styles.addSlotText}>Add 3rd Car</Text>
            <Text style={styles.addSlotSub}>Compare 3 cars</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#0F3040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  columnsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  carSlot: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  winnerCarSlot: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    backgroundColor: '#FFFDF5',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  winnerCrownTag: {
    position: 'absolute',
    top: -9,
    left: 10,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    zIndex: 5,
  },
  winnerCrownText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  swapBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#0F3040',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F3040',
    textAlign: 'center',
  },
  carTrim: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C4342B',
    textAlign: 'center',
  },
  addCarSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    padding: 10,
    minHeight: 125,
  },
  plusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 48, 64, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addSlotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F3040',
  },
  addSlotSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
