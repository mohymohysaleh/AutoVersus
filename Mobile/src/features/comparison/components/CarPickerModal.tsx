import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonCar } from '../types/comparison.types';

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

          {/* Car List */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
            {availableCars.map((car) => {
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
                      <Text style={styles.activeText}>In Comparison</Text>
                    </View>
                  ) : (
                    <View style={styles.selectBtn}>
                      <Text style={styles.selectBtnText}>Select</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    maxHeight: '80%',
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
    marginBottom: 16,
    paddingBottom: 12,
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
  listContainer: {
    gap: 12,
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
});
