import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarGridCard } from '../components/CarGridCard';
import { FilterModal } from '../components/FilterModal';
import { CarItem, FilterState } from '../types/catalog.types';
import { router } from 'expo-router';

const MOCK_CARS: CarItem[] = [
  {
    id: '1',
    brand: 'HYUNDAI',
    model: 'IONIQ 6',
    trimName: 'Limited',
    fullTitle: 'IONIQ 6 Limited',
    price: 'From EGP 2,450,000',
    priceAmount: 2450000,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    slug: 'hyundai-ioniq-6-limited',
    category: 'EV',
    bodyType: 'Sedan',
    rangeKm: 550,
    transmission: 'Auto',
    seats: 5,
  },
  {
    id: '2',
    brand: 'LAND ROVER',
    model: 'Range Rover',
    trimName: 'Velar',
    fullTitle: 'Range Rover Velar',
    price: 'From EGP 4,200,000',
    priceAmount: 4200000,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    slug: 'range-rover-velar',
    category: 'Hybrid',
    bodyType: 'SUV',
    fuelConsumption: '5.2 L/100km',
    transmission: 'Auto',
    seats: 5,
  },
  {
    id: '3',
    brand: 'LAND ROVER',
    model: 'Velar',
    trimName: 'Dynamic SE',
    fullTitle: 'Velar Dynamic SE',
    price: 'From EGP 4,500,000',
    priceAmount: 4500000,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    slug: 'velar-dynamic-se',
    category: 'Hybrid',
    bodyType: 'SUV',
    transmission: 'Auto',
    seats: 5,
  },
  {
    id: '4',
    brand: 'BMW',
    model: 'M3',
    trimName: 'Competition',
    fullTitle: 'M3 Competition',
    price: 'From EGP 5,200,000',
    priceAmount: 5200000,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    slug: 'bmw-m3-competition',
    category: 'Petrol',
    bodyType: 'Sedan',
    fuelConsumption: '8.7 L/100km',
    transmission: 'Auto',
    seats: 5,
  },
  {
    id: '5',
    brand: 'PORSCHE',
    model: 'Taycan',
    trimName: 'Sport',
    fullTitle: 'Taycan Sport',
    price: 'From EGP 4,800,000',
    priceAmount: 4800000,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    slug: 'porsche-taycan-sport',
    category: 'EV',
    bodyType: 'Coupe',
    rangeKm: 503,
    transmission: 'Auto',
    seats: 4,
  },
  {
    id: '6',
    brand: 'PORSCHE',
    model: 'Porsche Taycan',
    trimName: '4S',
    fullTitle: 'Porsche Taycan 4S',
    price: 'From EGP 5,450,000',
    priceAmount: 5450000,
    imageUrl: 'https://images.unsplash.com/photo-1611245141725-d7864f9f1d82?auto=format&fit=crop&w=800&q=80',
    slug: 'porsche-taycan-4s',
    category: 'EV',
    bodyType: 'Sedan',
    rangeKm: 590,
    transmission: 'Auto',
    seats: 4,
  },
];

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(3);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  const filteredCars = MOCK_CARS.filter(
    (car) =>
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.trimName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCarPress = (car: CarItem) => {
    // Navigate to Car Details Screen
    router.push({
      pathname: '/car/[slug]',
      params: { slug: car.slug },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header & Search Bar Row */}
      <View style={styles.topHeader}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Layout Toggle Icons */}
        <View style={styles.layoutToggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, layoutMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => setLayoutMode('grid')}
          >
            <Ionicons name="grid-outline" size={18} color={layoutMode === 'grid' ? '#0F2942' : '#9CA3AF'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, layoutMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setLayoutMode('list')}
          >
            <Ionicons name="list-outline" size={18} color={layoutMode === 'list' ? '#0F2942' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters & Sort Controls Bar */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.filtersPillButton}
          onPress={() => setIsFilterModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
          <Text style={styles.filtersPillText}>Filters</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Sort Dropdown Pill */}
        <TouchableOpacity style={styles.sortDropdown}>
          <Text style={styles.sortText}>Price: Low to High</Text>
          <Ionicons name="chevron-down" size={16} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Title Header */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.curatedLabel}>CURATED FOR YOU</Text>
          <Text style={styles.mainTitle}>Browse cars</Text>
        </View>
        <Text style={styles.resultCount}>{filteredCars.length} results</Text>
      </View>

      {/* Grid of Cars */}
      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        numColumns={layoutMode === 'grid' ? 2 : 1}
        key={layoutMode}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={layoutMode === 'grid' ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CarGridCard car={item} onPress={() => handleCarPress(item)} />
        )}
      />

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={(filters: FilterState) => {
          console.log('Applied filters:', filters);
          setActiveFiltersCount(
            filters.fuelTypes.length + filters.transmissions.length + filters.seats.length
          );
        }}
        resultCount={filteredCars.length}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  layoutToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    padding: 4,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  filtersPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  filterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C92A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  curatedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
});
