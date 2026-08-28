import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterState } from '../types/catalog.types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  resultCount?: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  resultCount = 24,
}) => {
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(['Hybrid', 'EV']);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(['Auto']);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['5']);
  const [maxPrice, setMaxPrice] = useState<number>(130000);

  const toggleFuel = (type: string) => {
    if (selectedFuelTypes.includes(type)) {
      setSelectedFuelTypes(selectedFuelTypes.filter((t) => t !== type));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, type]);
    }
  };

  const toggleTransmission = (trans: string) => {
    if (selectedTransmissions.includes(trans)) {
      setSelectedTransmissions(selectedTransmissions.filter((t) => t !== trans));
    } else {
      setSelectedTransmissions([...selectedTransmissions, trans]);
    }
  };

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleReset = () => {
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedSeats([]);
    setMaxPrice(150000);
  };

  const handleApply = () => {
    onApplyFilters({
      maxPrice,
      fuelTypes: selectedFuelTypes,
      transmissions: selectedTransmissions,
      seats: selectedSeats,
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetContainer}>
              {/* Grab Bar Indicator */}
              <View style={styles.grabBar} />

              {/* Header Row */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.refineLabel}>REFINE</Text>
                  <Text style={styles.headerTitle}>Filters</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
                {/* 1. Price Range Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Price Range</Text>
                    <Text style={styles.priceValueText}>
                      Up to EGP {(maxPrice * 35).toLocaleString()}
                    </Text>
                  </View>

                  {/* Simulated Price Slider Track */}
                  <View style={styles.sliderTrackContainer}>
                    <View style={[styles.sliderTrackActive, { width: '82%' }]} />
                    <View style={[styles.sliderThumb, { left: '80%' }]} />
                  </View>
                  <View style={styles.sliderLabelsRow}>
                    <Text style={styles.sliderMinMaxLabel}>EGP 1M</Text>
                    <Text style={styles.sliderMinMaxLabel}>EGP 5M+</Text>
                  </View>
                </View>

                {/* 2. Fuel Type Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Fuel Type</Text>
                  <View style={styles.chipsRow}>
                    {['Petrol', 'Hybrid', 'EV'].map((fuel) => {
                      const isSelected = selectedFuelTypes.includes(fuel);
                      return (
                        <TouchableOpacity
                          key={fuel}
                          style={[styles.chip, isSelected ? styles.chipActive : styles.chipInactive]}
                          onPress={() => toggleFuel(fuel)}
                          activeOpacity={0.8}
                        >
                          {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />}
                          <Text style={[styles.chipText, isSelected ? styles.chipTextActive : styles.chipTextInactive]}>
                            {fuel}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Transmission Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Transmission</Text>
                  <View style={styles.chipsRow}>
                    {['Auto', 'Manual'].map((trans) => {
                      const isSelected = selectedTransmissions.includes(trans);
                      return (
                        <TouchableOpacity
                          key={trans}
                          style={[styles.chip, isSelected ? styles.chipActive : styles.chipInactive]}
                          onPress={() => toggleTransmission(trans)}
                          activeOpacity={0.8}
                        >
                          {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />}
                          <Text style={[styles.chipText, isSelected ? styles.chipTextActive : styles.chipTextInactive]}>
                            {trans}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Seating Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Seating</Text>
                  <View style={styles.chipsRow}>
                    {['5', '7+'].map((seat) => {
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <TouchableOpacity
                          key={seat}
                          style={[styles.circleChip, isSelected ? styles.chipActive : styles.chipInactive]}
                          onPress={() => toggleSeat(seat)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.chipText, isSelected ? styles.chipTextActive : styles.chipTextInactive]}>
                            {seat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Action Footer */}
              <View style={styles.footerRow}>
                <TouchableOpacity onPress={handleReset} activeOpacity={0.7} style={styles.resetButton}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleApply} activeOpacity={0.85} style={styles.applyButton}>
                  <Text style={styles.applyText}>Apply {resultCount} Results</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  grabBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  refineLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F2942',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  priceValueText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C92A2A',
  },
  sliderTrackContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
    marginVertical: 12,
  },
  sliderTrackActive: {
    height: 6,
    backgroundColor: '#0F2942',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F2942',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderMinMaxLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  circleChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#0F2942',
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: '#4B5563',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0F2942',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
