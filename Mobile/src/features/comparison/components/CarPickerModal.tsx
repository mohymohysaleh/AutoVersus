import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonCar } from '../types/comparison.types';
import { catalogApi } from '../../catalog/api/catalog.api';
import { mapVariantToComparisonCar } from '../../../shared/utils/comparison-mapper';

interface CarPickerModalProps {
  visible: boolean;
  availableCars: ComparisonCar[];
  selectedCarIds: string[];
  onClose: () => void;
  onSelectCar: (car: ComparisonCar) => void;
}

export const CarPickerModal: React.FC<CarPickerModalProps> = ({
  visible,
  availableCars,
  selectedCarIds,
  onClose,
  onSelectCar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbCars, setDbCars] = useState<ComparisonCar[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadAllDbVehicles();
    }
  }, [visible]);

  const loadAllDbVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await catalogApi.searchVehicles({ limit: 300 });
      if (res.items && res.items.length > 0) {
        const mapped = res.items.map((v) => mapVariantToComparisonCar(v));
        // Merge with availableCars (avoiding duplicate IDs)
        const existingIds = new Set(mapped.map((c) => c.id));
        const combined = [
          ...mapped,
          ...availableCars.filter((c) => !existingIds.has(c.id)),
        ];
        setDbCars(combined);
      } else {
        setDbCars(availableCars);
      }
    } catch (err) {
      console.warn('Failed to fetch DB cars for comparison picker:', err);
      setDbCars(availableCars);
    } finally {
      setIsLoading(false);
    }
  };

  const displayCarsList = dbCars.length > 0 ? dbCars : availableCars;

  const filteredCars = displayCarsList.filter((car) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      car.brandName.toLowerCase().includes(q) ||
      car.modelName.toLowerCase().includes(q) ||
      car.trimName.toLowerCase().includes(q)
    );
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Select Vehicle to Compare</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Input Bar */}
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search make, model or trim (e.g. Toyota, BMW)..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Loading Indicator */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0F3040" />
              <Text style={styles.loadingText}>Fetching database vehicle specs...</Text>
            </View>
          ) : (
            /* Car List */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
              {filteredCars.map((car) => {
                const isAlreadySelected = selectedCarIds.includes(car.id);
                return (
                  <TouchableOpacity
                    key={car.id}
                    style={[styles.carItem, isAlreadySelected && styles.carItemDisabled]}
                    disabled={isAlreadySelected}
                    onPress={() => {
                      onSelectCar(car);
                      onClose();
                    }}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: car.imageUrl }} style={styles.carThumb} resizeMode="cover" />
                    <View style={styles.infoCol}>
                      <Text style={styles.carTitle}>
                        {car.brandName} {car.modelName}
                      </Text>
                      <Text style={styles.carTrim}>
                        {car.year} • {car.trimName}
                      </Text>
                      <Text style={styles.priceText}>EGP {car.startingPriceEGP.toLocaleString()}</Text>
                    </View>

                    {isAlreadySelected ? (
                      <View style={styles.activeBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                        <Text style={styles.activeText}>In Matrix</Text>
                      </View>
                    ) : (
                      <View style={styles.selectBtn}>
                        <Text style={styles.selectBtnText}>Select</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {filteredCars.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No matching cars found in database.</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 48, 64, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F3040',
  },
  closeBtn: {
    padding: 4,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F3040',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  listContainer: {
    gap: 10,
    paddingBottom: 24,
  },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  carItemDisabled: {
    opacity: 0.6,
    backgroundColor: '#F1F5F9',
  },
  carThumb: {
    width: 64,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
  infoCol: {
    flex: 1,
  },
  carTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F3040',
  },
  carTrim: {
    fontSize: 12,
    color: '#64748B',
    marginVertical: 2,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C4342B',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  selectBtn: {
    backgroundColor: '#0F3040',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});
