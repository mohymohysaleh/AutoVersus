import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarGridCard } from '../components/CarGridCard';
import { FilterModal } from '../components/FilterModal';
import { CarItem, FilterState } from '../types/catalog.types';
import { catalogApi, BrandDto } from '../api/catalog.api';
import { router } from 'expo-router';
import { resolveCarImage } from '../../../shared/utils/car-image.utils';
import { useLanguage } from '../../../shared/context/LanguageContext';

export const SearchScreen: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Dynamic Catalog State (100% API Driven from PostgreSQL Database)
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);
  const [carsList, setCarsList] = useState<CarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Brands & Vehicles from Backend API on mount
  useEffect(() => {
    loadCatalogData();
  }, []);

  const loadCatalogData = async (brandSlug?: string | null) => {
    setIsLoading(true);
    try {
      if (brands.length === 0) {
        const fetchedBrands = await catalogApi.fetchBrands();
        if (fetchedBrands && fetchedBrands.length > 0) {
          setBrands(fetchedBrands);
        }
      }

      const searchRes = await catalogApi.searchVehicles({
        brandSlug: brandSlug || undefined,
        limit: 300,
      });

      if (searchRes.items && searchRes.items.length > 0) {
        const mappedItems: CarItem[] = searchRes.items.map((item) => ({
          id: item.id,
          brand: item.brandName.toUpperCase(),
          model: item.modelName,
          trimName: item.trimName,
          fullTitle: `${item.brandName} ${item.modelName} ${item.trimName}`,
          price: item.startingPriceEGP ? `From EGP ${item.startingPriceEGP.toLocaleString()}` : 'Price on Request',
          priceAmount: item.startingPriceEGP || 0,
          imageUrl: resolveCarImage(item.brandName, item.modelName, item.trimName, item.engine?.fuelType),
          slug: item.slug,
          category: item.engine?.fuelType || 'Petrol',
          bodyType: 'Sedan',
          transmission: item.engine?.transmission || 'Auto',
          seats: 5,
        }));
        setCarsList(mappedItems);
      } else {
        setCarsList([]);
      }
    } catch (err) {
      console.warn('Catalog load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBrand = (slug: string | null) => {
    setSelectedBrandSlug(slug);
    loadCatalogData(slug);
  };

  const filteredCars = carsList.filter((car) => {
    const matchesSearch =
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.trimName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = !selectedBrandSlug || car.brand.toLowerCase() === selectedBrandSlug.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const selectedBrandObject = brands.find((b) => b.slug.toLowerCase() === selectedBrandSlug?.toLowerCase());

  const handleCarPress = (car: CarItem) => {
    router.push({
      pathname: '/car/[slug]',
      params: { slug: car.slug },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Search & Layout Toggle Bar */}
      <View style={styles.topHeader}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Layout Toggle Buttons */}
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
            activeOpacity={0.8}
          >
            <Ionicons name="list-outline" size={18} color={layoutMode === 'list' ? '#0F2942' : '#64748B'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Brand Selector Carousel */}
      <View style={styles.brandSelectorContainer}>
        <View style={styles.brandSelectorHeader}>
          <Text style={styles.sectionLabel}>{t('catalog.allBrands').toUpperCase()}</Text>
          {selectedBrandSlug && (
            <TouchableOpacity
              style={styles.clearBrandButton}
              onPress={() => handleSelectBrand(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.clearBrandText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandPillScroll}>
          {/* ALL BRANDS PILL */}
          <TouchableOpacity
            style={[styles.brandPill, !selectedBrandSlug && styles.brandPillActive]}
            onPress={() => handleSelectBrand(null)}
            activeOpacity={0.8}
          >
            <Text style={[styles.brandPillText, !selectedBrandSlug && styles.brandPillTextActive]}>
              {t('catalog.allBrands')}
            </Text>
          </TouchableOpacity>

          {/* BRAND PILLS */}
          {brands.map((b) => {
            const isActive = selectedBrandSlug === b.slug;
            return (
              <TouchableOpacity
                key={b.id || b.slug}
                style={[styles.brandPill, isActive && styles.brandPillActive]}
                onPress={() => handleSelectBrand(b.slug)}
                activeOpacity={0.8}
              >
                <Text style={[styles.brandPillText, isActive && styles.brandPillTextActive]}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* AUTO-DATA STYLED BRAND HIERARCHY BANNER (When Brand Selected) */}
      {selectedBrandSlug && (
        <View style={styles.autoDataBrandCard}>
          <View style={styles.autoDataHeaderRow}>
            <View style={styles.brandBadgeSquare}>
              <Text style={styles.brandBadgeLetter}>
                {selectedBrandObject?.name ? selectedBrandObject.name.charAt(0) : 'B'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.autoDataBrandTitle}>{selectedBrandObject?.name}</Text>
              <Text style={styles.autoDataBrandSub}>
                {selectedBrandObject?.country ? `${selectedBrandObject.country}` : 'Global Brand'} • {filteredCars.length} {t('catalog.resultsCount')}
              </Text>
            </View>
            <TouchableOpacity style={styles.viewAllBrandModelsBtn} onPress={() => handleSelectBrand(null)}>
              <Ionicons name="apps-outline" size={16} color="#0F2942" />
              <Text style={styles.viewAllBrandModelsText}>{t('catalog.allBrands')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Controls Bar (Filter Modal Trigger & Sort) */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.filtersPillButton}
          onPress={() => setIsFilterModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color="#FFFFFF" />
          <Text style={styles.filtersPillText}>{t('catalog.filterSpecs')}</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortDropdown}>
          <Text style={styles.sortText}>{t('catalog.priceLowHigh')}</Text>
          <Ionicons name="chevron-down" size={16} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Section Title */}
      <View style={styles.titleRow}>
        <Text style={styles.mainTitle}>
          {selectedBrandObject ? `${selectedBrandObject.name}` : t('catalog.title')}
        </Text>
        <Text style={styles.resultCount}>{filteredCars.length} {t('catalog.resultsCount')}</Text>
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#0F2942" size="large" />
          <Text style={styles.loadingText}>Fetching database specifications...</Text>
        </View>
      ) : (
        /* Grid of Cars */
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-sport-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No cars found</Text>
              <Text style={styles.emptySub}>Try searching another brand or clearing filters.</Text>
              <TouchableOpacity style={styles.resetButton} onPress={() => handleSelectBrand(null)}>
                <Text style={styles.resetButtonText}>Reset Catalog Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={(filters: FilterState) => {
          setActiveFiltersCount(filters.fuelTypes.length + filters.transmissions.length + filters.seats.length);
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
    borderColor: '#E5E7EB',
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
  brandSelectorContainer: {
    marginBottom: 12,
  },
  brandSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1.2,
  },
  clearBrandButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearBrandText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C92A2A',
  },
  brandPillScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  brandPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  brandPillActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  brandPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  brandPillTextActive: {
    color: '#FFFFFF',
  },
  autoDataBrandCard: {
    marginHorizontal: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  autoDataHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBadgeSquare: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  autoDataBrandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F2942',
  },
  autoDataBrandSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  viewAllBrandModelsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  viewAllBrandModelsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F2942',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filtersPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  filtersPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  filterBadge: {
    backgroundColor: '#C92A2A',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F2942',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F2942',
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
  },
  resetButton: {
    marginTop: 12,
    backgroundColor: '#0F2942',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
