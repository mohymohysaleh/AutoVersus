import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CarDetailsScreenProps {
  slug?: string;
}

export const CarDetailsScreen: React.FC<CarDetailsScreenProps> = ({ slug }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Specs' | 'Safety' | 'Features'>('Overview');
  const [selectedTrim, setSelectedTrim] = useState('4S');
  const [isSaved, setIsSaved] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/search');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconCircleButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Taycan 4S</Text>

        <View style={styles.rightNavIcons}>
          <TouchableOpacity style={styles.iconCircleButton}>
            <Ionicons name="share-outline" size={18} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircleButton}>
            <Ionicons name="swap-horizontal" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Details Body */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Hero Gallery Container */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Bottom Left 360 Badge */}
          <TouchableOpacity style={styles.threeSixtyBadge} activeOpacity={0.8}>
            <Ionicons name="sync-outline" size={16} color="#0F2942" />
            <Text style={styles.threeSixtyText}>360° View</Text>
          </TouchableOpacity>

          {/* Bottom Right Pagination Dots */}
          <View style={styles.paginationRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Vehicle Header Info */}
        <View style={styles.infoSection}>
          <Text style={styles.categoryTag}>ALL-ELECTRIC SPORTS SEDAN</Text>

          <View style={styles.titleTrimRow}>
            <Text style={styles.carTitle}>2026 Porsche Taycan 4S</Text>
            <TouchableOpacity style={styles.trimDropdown}>
              <Text style={styles.trimText}>{selectedTrim}</Text>
              <Ionicons name="chevron-down" size={16} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Price Label */}
          <Text style={styles.priceLabel}>Starting price</Text>
          <Text style={styles.priceValue}>EGP 5,450,000</Text>

          {/* Quick Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
              <Ionicons name="swap-horizontal-outline" size={18} color="#0F2942" />
              <Text style={styles.outlineBtnText}>Add to Compare</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.solidBtn, isSaved && styles.solidBtnSaved]}
              onPress={() => setIsSaved(!isSaved)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isSaved ? '#C92A2A' : '#0F2942'}
              />
              <Text style={[styles.solidBtnText, isSaved && styles.solidBtnTextSaved]}>
                {isSaved ? 'Saved in Garage' : 'Save to Garage'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Tabs Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
            {(['Overview', 'Specs', 'Safety', 'Features'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Overview Specs Grid */}
          <View style={styles.overviewGrid}>
            <View style={styles.specBox}>
              <Ionicons name="flash-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
              <Text style={styles.specBoxLabel}>Horsepower</Text>
              <Text style={styles.specBoxValue}>523 HP</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="battery-charging-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
              <Text style={styles.specBoxLabel}>Battery Range</Text>
              <Text style={styles.specBoxValue}>590 km</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="speedometer-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
              <Text style={styles.specBoxLabel}>0 - 100 km/h</Text>
              <Text style={styles.specBoxValue}>3.8 sec</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#0F2942" style={{ marginBottom: 6 }} />
              <Text style={styles.specBoxLabel}>Airbags</Text>
              <Text style={styles.specBoxValue}>10 Airbags</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Footer */}
      <View style={styles.bottomCtaContainer}>
        <TouchableOpacity style={styles.dealershipCtaButton} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Find Dealerships / Request Quote</Text>
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  rightNavIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollBody: {
    paddingBottom: 90,
  },
  heroImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#111827',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  threeSixtyBadge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  threeSixtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F2942',
  },
  paginationRow: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#C92A2A',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 6,
  },
  titleTrimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  carTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  trimDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  trimText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  priceLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C92A2A',
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0F2942',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  solidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
  },
  solidBtnSaved: {
    backgroundColor: '#FEE2E2',
  },
  solidBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F2942',
  },
  solidBtnTextSaved: {
    color: '#C92A2A',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderColor: '#0F2942',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#0F2942',
    fontWeight: '700',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  specBox: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  specBoxLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  specBoxValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  bottomCtaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  dealershipCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F2942',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C92A2A',
  },
});
